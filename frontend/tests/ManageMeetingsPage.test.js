import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManageMeetingsPage from '../src/pages/ManageMeetingsPage';
import axios from 'axios';
import axiosMockAdapter from 'axios-mock-adapter';
import '@testing-library/jest-dom';

const mock = new axiosMockAdapter(axios);

beforeAll(() => {
  global.localStorage = {
    getItem: jest.fn().mockImplementation((key) => {
      if (key === 'token') return 'test-token';
      return null;
    }),
  };
});

describe('ManageMeetingsPage', () => {
  beforeEach(() => {
    mock.reset();
  });

  test('renders no meetings message when no meetings are scheduled', async () => {
    mock.onGet('https://localhost:5000/api/meetings/unattended').reply(200, []);

    render(<ManageMeetingsPage />);

    await waitFor(() => {
      expect(screen.getByText('No meetings scheduled for the future.')).toBeInTheDocument();
    });
  });

  test('renders meetings and handles edit and delete actions', async () => {
    const meetings = [
      {
        _id: '1',
        title: 'Meeting 1',
        dateTime: new Date().toISOString(),
        participants: [{ _id: '1', username: 'user1' }],
      },
      {
        _id: '2',
        title: 'Meeting 2',
        dateTime: new Date().toISOString(),
        participants: [{ _id: '2', username: 'user2' }],
      },
    ];

    mock.onGet('https://localhost:5000/api/meetings/unattended').reply(200, meetings);

    render(<ManageMeetingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Manage Meetings')).toBeInTheDocument();
      expect(screen.getByText('Meeting 1')).toBeInTheDocument();
      expect(screen.getByText('Meeting 2')).toBeInTheDocument();
    });

    // Edit Meeting
    fireEvent.click(screen.getAllByText('Edit')[0]);
    await waitFor(() => {
      expect(screen.getByText('Edit Meeting')).toBeInTheDocument();
    });

    // Cancel Edit
    fireEvent.click(screen.getByText('Cancel'));
    await waitFor(() => {
      expect(screen.queryByText('Edit Meeting')).not.toBeInTheDocument();
    });

    // Delete Meeting
    mock.onDelete('https://localhost:5000/api/meetings/1').reply(200);
    fireEvent.click(screen.getAllByText('Delete')[0]);
    await waitFor(() => {
      expect(screen.queryByText('Meeting 1')).not.toBeInTheDocument();
    });
  });

  test('handles error fetching meetings', async () => {
    mock.onGet('https://localhost:5000/api/meetings/unattended').reply(500);

    render(<ManageMeetingsPage />);

    await waitFor(() => {
      expect(screen.getByText('No meetings scheduled for the future.')).toBeInTheDocument();
    });
  });
});