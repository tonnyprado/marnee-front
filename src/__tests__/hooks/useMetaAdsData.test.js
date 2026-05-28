/**
 * useMetaAdsData Hook Tests
 */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useMetaAdsData } from '../../hooks/useMetaAdsData';

// Mock the API
jest.mock('../../services/metaAdsApi', () => ({
  getMetaAdsStatus: jest.fn()
}));

import { getMetaAdsStatus } from '../../services/metaAdsApi';

describe('useMetaAdsData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should start with loading state', () => {
    getMetaAdsStatus.mockImplementation(() => new Promise(() => {})); // Never resolves

    const { result } = renderHook(() => useMetaAdsData());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isConnected).toBe(false);
    expect(result.current.hasData).toBe(false);
  });

  it('should update state when connected', async () => {
    getMetaAdsStatus.mockResolvedValue({
      connected: true,
      accountName: 'Test Account',
      accountId: '456'
    });

    const { result } = renderHook(() => useMetaAdsData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(true);
    expect(result.current.hasData).toBe(true);
    expect(result.current.connectionInfo.accountName).toBe('Test Account');
    expect(result.current.error).toBeNull();
  });

  it('should update state when not connected', async () => {
    getMetaAdsStatus.mockResolvedValue({
      connected: false
    });

    const { result } = renderHook(() => useMetaAdsData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.hasData).toBe(false);
  });

  it('should handle 404 errors gracefully (no connection)', async () => {
    const error404 = new Error('Not found');
    error404.status = 404;
    getMetaAdsStatus.mockRejectedValue(error404);

    const { result } = renderHook(() => useMetaAdsData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.hasData).toBe(false);
    expect(result.current.error).toBeNull(); // 404 is not treated as error
  });

  it('should handle 503 errors gracefully (service unavailable)', async () => {
    const error503 = new Error('Service unavailable');
    error503.status = 503;
    getMetaAdsStatus.mockRejectedValue(error503);

    const { result } = renderHook(() => useMetaAdsData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.hasData).toBe(false);
    expect(result.current.error).toBeNull(); // 503 is not treated as error
  });

  it('should handle 404 errors with response object', async () => {
    const error404 = new Error('Not found');
    error404.response = { status: 404 };
    getMetaAdsStatus.mockRejectedValue(error404);

    const { result } = renderHook(() => useMetaAdsData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle 503 errors with response object', async () => {
    const error503 = new Error('Service unavailable');
    error503.response = { status: 503 };
    getMetaAdsStatus.mockRejectedValue(error503);

    const { result } = renderHook(() => useMetaAdsData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle other errors', async () => {
    const error500 = new Error('Server error');
    error500.status = 500;
    getMetaAdsStatus.mockRejectedValue(error500);

    const { result } = renderHook(() => useMetaAdsData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);
    expect(result.current.hasData).toBe(false);
    expect(result.current.error).toBe(error500);
  });

  it('should have refresh function', async () => {
    getMetaAdsStatus.mockResolvedValue({ connected: false });

    const { result } = renderHook(() => useMetaAdsData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(typeof result.current.refresh).toBe('function');
  });

  it('should refresh data when refresh is called', async () => {
    getMetaAdsStatus.mockResolvedValueOnce({ connected: false });

    const { result } = renderHook(() => useMetaAdsData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isConnected).toBe(false);

    // Now mock a connected state for the refresh call
    getMetaAdsStatus.mockResolvedValueOnce({ connected: true, accountName: 'New Account' });

    act(() => {
      result.current.refresh();
    });

    await waitFor(() => {
      expect(result.current.isConnected).toBe(true);
    });

    expect(result.current.connectionInfo.accountName).toBe('New Account');
    expect(getMetaAdsStatus).toHaveBeenCalledTimes(2);
  });

  it('should set loading state during refresh', async () => {
    let resolvePromise;
    getMetaAdsStatus.mockResolvedValueOnce({ connected: false });

    const { result } = renderHook(() => useMetaAdsData());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Create a promise that we control
    getMetaAdsStatus.mockImplementationOnce(() => new Promise(resolve => {
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
