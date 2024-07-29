import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditMeetingForm from '../src/components/EditMeetingsForm';

const meeting = {
  _id: '1',
  title: 'Test Meeting',
  dateTime: '2023-10-10T10:00',
  participants: [{ _id: '1', username: 'user1' }]
};

const setup = (props = {}) => {
  const utils = render(<EditMeetingForm {...props} />);
  const titleInput = screen.getByLabelText(/meeting title/i);
  const dateTimeInput = screen.getByLabelText(/date/i);
  const participantSearchInput = screen.getByPlaceholderText(/search for participants/i);
  return {
    ...utils,
    titleInput,
    dateTimeInput,
    participantSearchInput,
  };
};

describe('EditMeetingForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders form with initial values', () => {
    setup({ meeting, onSave: jest.fn(), onCancel: jest.fn() });
    expect(screen.getByLabelText(/meeting title/i)).toHaveValue(meeting.title);
    expect(screen.getByLabelText(/date/i)).toHaveValue(meeting.dateTime);
    expect(screen.getByText(/user1/)).toBeInTheDocument();
  });

  test('removes participant on double click', () => {
    setup({ meeting, onSave: jest.fn(), onCancel: jest.fn() });
    const participantItem = screen.getByText(/user1/);
    fireEvent.doubleClick(participantItem);
    expect(participantItem).not.toBeInTheDocument();
  });

  test('handles cancel', () => {
    const onCancel = jest.fn();
    setup({ meeting, onSave: jest.fn(), onCancel });
    fireEvent.click(screen.getByText(/cancel/i));
    expect(onCancel).toHaveBeenCalled();
  });
});