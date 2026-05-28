/**
 * useInstagramData Hook Tests
 */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useInstagramData } from '../../hooks/useInstagramData';

// Mock the API
jest.mock('../../services/instagramApi', () => ({
  getInstagramStatus: jest.fn()
}));

import { getInstagramStatus } from '../../services/instagramApi';

describe('useInstagramData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with loading state', () => {
    getInstagramStatus.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useInstagramData());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isConnected).toBe(false);
    expect(result.current.hasData).toBe(false);
  });

  it('should update state when connected', async () => {
    getInstagramStatus.mockResolvedValue({
      connected: true,
      username: 'testuser',
      accountId: '123'
    });

    const { result } = renderHook(() => useInstagramData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.hasData).toBe(true);
    expect(result.current.connectionInfo.username).toBe('testuser');
    expect(result.current.error).toBeNull();
  });

  it('should update state when not connected', async () => {
    getInstagramStatus.mockResolvedValue({
      connected: false
    });

    const { result } = renderHook(() => useInstagramData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.hasData).toBe(false);
  });

  it('should handle 404 errors gracefully (no connection)', async () => {
    const error404 = new Error('Not found');
    error404.status = 404;
    getInstagramStatus.mockRejectedValue(error404);

    const { result } = renderHook(() => useInstagramData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.hasData).toBe(false);
    expect(result.current.error).toBeNull(); // 404 is not treated as error
  });

  it('should handle 404 errors with response object', async () => {
    const error404 = new Error('Not found');
    error404.response = { status: 404 };
    getInstagramStatus.mockRejectedValue(error404);

    const { result } = renderHook(() => useInstagramData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle other errors', async () => {
    const error500 = new Error('Server error');
    error500.status = 500;
    getInstagramStatus.mockRejectedValue(error500);

    const { result } = renderHook(() => useInstagramData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.hasData).toBe(false);
    expect(result.current.error).toBe(error500);
  });

  it('should have refresh function', async () => {
    getInstagramStatus.mockResolvedValue({ connected: false });

    const { result } = renderHook(() => useInstagramData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refresh).toBe('function');
  });

  it('should refresh data when refresh is called', async () => {
    getInstagramStatus.mockResolvedValueOnce({ connected: false });

    const { result } = renderHook(() => useInstagramData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);

    // Now mock a connected state for the refresh call
    getInstagramStatus.mockResolvedValueOnce({ connected: true, username: 'newuser' });

    act(() => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    expect(result.current.connectionInfo.username).toBe('newuser');
    expect(getInstagramStatus).toHaveBeenCalledTimes(2);
  });

  it('should set loading state during refresh', async () => {
    let resolvePromise;
    getInstagramStatus.mockResolvedValueOnce({ connected: false });

    const { result } = renderHook(() => useInstagramData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Create a promise that we control
    getInstagramStatus.mockImplementationOnce(() => new Promise(resolve => {
      resolvePromise = resolve;
    }));

    act(() => {
      result.current.refresh();
    });

    // Should be loading now
    expect(result.current.isLoading).toBe(true);

    // Resolve the promise
    act(() => {
      resolvePromise({ connected: true });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
