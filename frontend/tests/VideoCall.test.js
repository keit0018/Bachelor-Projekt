import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import VideoCall from '../src/components/VideoCall'; 
import axios from 'axios';
import '@testing-library/jest-dom';
import { FluentThemeProvider, CallComposite } from '@azure/communication-react';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { Oval } from 'react-loader-spinner';

jest.mock('axios');
jest.mock('@azure/communication-react', () => ({
    FluentThemeProvider: ({ children }) => <div>{children}</div>,
    CallComposite: () => <div>Call Composite Mock</div>,
    createAzureCommunicationCallAdapter: jest.fn().mockResolvedValue({
      getState: jest.fn().mockReturnValue({
        call: {
          state: 'Connected',
          info: {
            getServerCallId: jest.fn().mockResolvedValue('server-call-id'),
          },
        },
      }),
      onStateChange: jest.fn().mockImplementation((cb) => cb()),
      on: jest.fn(),
      dispose: jest.fn(),
    }),
}));
  
jest.mock('@azure/communication-common', () => ({
AzureCommunicationTokenCredential: jest.fn(),
}));
  
beforeAll(() => {
global.localStorage = {
    getItem: jest.fn().mockImplementation((key) => {
    switch (key) {
        case 'communicationUserId':
        return 'test-user-id';
        case 'username':
        return 'test-username';
        default:
        return null;
    }
    }),
};
});
  

describe('VideoCall Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading spinner initially', () => {
    render(<VideoCall meetingId="123" />);
    expect(screen.getByLabelText('oval-loading')).toBeInTheDocument();
  });

  test('fetches participants and token correctly', async () => {
    axios.get.mockResolvedValueOnce({
      data: { participants: [], createdBy: { communicationUserId: 'test-id' }, groupId: 'group-123' },
    });
    axios.post.mockResolvedValueOnce({ data: { token: 'test-token' } });

    render(<VideoCall meetingId="123" />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  });

  test('does not call startRecording if not creator', async () => {
    axios.get.mockResolvedValueOnce({
      data: { participants: [], createdBy: { communicationUserId: 'another-user-id' }, groupId: 'group-123' },
    });
    axios.post.mockResolvedValueOnce({ data: { token: 'test-token' } });

    render(<VideoCall meetingId="123" />);

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Verify startRecording is not called
    expect(axios.post).not.toHaveBeenCalledWith('https://localhost:5000/api/recordings/startRecording', expect.any(Object));
  });
});