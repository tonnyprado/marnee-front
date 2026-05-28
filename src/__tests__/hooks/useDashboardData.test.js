/**
 * useDashboardData Hook Tests
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useDashboardData } from '../../hooks/useDashboardData';

// Mock the dependent hooks
jest.mock('../../hooks/useInstagramData', () => ({
  useInstagramData: jest.fn()
}));

jest.mock('../../hooks/useMetaAdsData', () => ({
  useMetaAdsData: jest.fn()
}));

import { useInstagramData } from '../../hooks/useInstagramData';
import { useMetaAdsData } from '../../hooks/useMetaAdsData';

describe('useDashboardData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should combine instagram and metaAds data', () => {
    const mockInstagramRefresh = jest.fn();
    const mockMetaAdsRefresh = jest.fn();

    useInstagramData.mockReturnValue({
      isLoading: false,
      isConnected: true,
      hasData: true,
      error: null,
      refresh: mockInstagramRefresh
    });

    useMetaAdsData.mockReturnValue({
      isLoading: false,
      isConnected: true,
      hasData: true,
      error: null,
      refresh: mockMetaAdsRefresh
    });

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.instagram).toBeDefined();
    expect(result.current.metaAds).toBeDefined();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.hasAnyData).toBe(true);
  });

  it('should return isLoading true when instagram is loading', () => {
    useInstagramData.mockReturnValue({
      isLoading: true,
      isConnected: false,
      hasData: false,
      refresh: jest.fn()
    });

    useMetaAdsData.mockReturnValue({
      isLoading: false,
      isConnected: false,
      hasData: false,
      refresh: jest.fn()
    });

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.isLoading).toBe(true);
  });

  it('should return isLoading true when metaAds is loading', () => {
    useInstagramData.mockReturnValue({
      isLoading: false,
      isConnected: false,
      hasData: false,
      refresh: jest.fn()
    });

    useMetaAdsData.mockReturnValue({
      isLoading: true,
      isConnected: false,
      hasData: false,
      refresh: jest.fn()
    });

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.isLoading).toBe(true);
  });

  it('should return isLoading false when both are done loading', () => {
    useInstagramData.mockReturnValue({
      isLoading: false,
      isConnected: false,
      hasData: false,
      refresh: jest.fn()
    });

    useMetaAdsData.mockReturnValue({
      isLoading: false,
      isConnected: false,
      hasData: false,
      refresh: jest.fn()
    });

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.isLoading).toBe(false);
  });

  it('should return hasAnyData true when instagram has data', () => {
    useInstagramData.mockReturnValue({
      isLoading: false,
      hasData: true,
      refresh: jest.fn()
    });

    useMetaAdsData.mockReturnValue({
      isLoading: false,
      hasData: false,
      refresh: jest.fn()
    });

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.hasAnyData).toBe(true);
  });

  it('should return hasAnyData true when metaAds has data', () => {
    useInstagramData.mockReturnValue({
      isLoading: false,
      hasData: false,
      refresh: jest.fn()
    });

    useMetaAdsData.mockReturnValue({
      isLoading: false,
      hasData: true,
      refresh: jest.fn()
    });

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.hasAnyData).toBe(true);
  });

  it('should return hasAnyData true when both have data', () => {
    useInstagramData.mockReturnValue({
      isLoading: false,
      hasData: true,
      refresh: jest.fn()
    });

    useMetaAdsData.mockReturnValue({
      isLoading: false,
      hasData: true,
      refresh: jest.fn()
    });

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.hasAnyData).toBe(true);
  });

  it('should return hasAnyData false when neither has data', () => {
    useInstagramData.mockReturnValue({
      isLoading: false,
      hasData: false,
      refresh: jest.fn()
    });

    useMetaAdsData.mockReturnValue({
      isLoading: false,
      hasData: false,
      refresh: jest.fn()
    });

    const { result } = renderHook(() => useDashboardData());

    expect(result.current.hasAnyData).toBe(false);
  });

  it('should call both refresh functions when refreshAll is called', () => {
    const mockInstagramRefresh = jest.fn();
    const mockMetaAdsRefresh = jest.fn();

    useInstagramData.mockReturnValue({
      isLoading: false,
      hasData: false,
      refresh: mockInstagramRefresh
    });

    useMetaAdsData.mockReturnValue({
      isLoading: false,
      hasData: false,
      refresh: mockMetaAdsRefresh
    });

    const { result } = renderHook(() => useDashboardData());

    act(() => {
      result.current.refreshAll();
    });

    expect(mockInstagramRefresh).toHaveBeenCalledTimes(1);
    expect(mockMetaAdsRefresh).toHaveBeenCalledTimes(1);
  });

  it('should expose individual connection states', () => {
    const instagramData = {
      isLoading: false,
      isConnected: true,
      hasData: true,
      error: null,
      connectionInfo: { username: 'test' },
      refresh: jest.fn()
    };

    const metaAdsData = {
      isLoading: false,
      isConnected: false,
      hasData: false,
      error: { message: 'Not connected' },
      connectionInfo: null,
      refresh: jest.fn()
    };

    useInstagramData.mockReturnValue(instagramData);
    useMetaAdsData.mockReturnValue(metaAdsData);

    const { result } = renderHook(() => useDashboardData());

    // Instagram should be accessible
    expect(result.current.instagram.isConnected).toBe(true);
    expect(result.current.instagram.connectionInfo.username).toBe('test');

    // MetaAds should be accessible
    expect(result.current.metaAds.isConnected).toBe(false);
    expect(result.current.metaAds.error).toBeDefined();
  });
});
