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
    mock.onGet('http://localhost:5000/api/meetings/unattended').reply(200, []);

    render(<ManageMeetingsPage />);

    await waitFor(() => {
      expect(screen.getByText('No meetings scheduled for the future.')).toBeInTheDocument();
    });
  });

});