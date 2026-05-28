/**
 * useBrandProfile Hook Tests
 */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useBrandProfile } from '../../hooks/useBrandProfile';

// Mock the API
jest.mock('../../services/brandProfileApi', () => ({
  getBrandProfileByFounder: jest.fn(),
  generateBrandProfile: jest.fn(),
  updateBrandProfile: jest.fn(),
  regenerateBrandProfileSection: jest.fn(),
  uploadBrandGuidelines: jest.fn(),
  getBrandGuidelines: jest.fn(),
  deleteBrandGuidelines: jest.fn(),
  default: {
    getBrandProfileByFounder: jest.fn(),
    generateBrandProfile: jest.fn(),
    updateBrandProfile: jest.fn(),
    regenerateBrandProfileSection: jest.fn(),
    uploadBrandGuidelines: jest.fn(),
    getBrandGuidelines: jest.fn(),
    deleteBrandGuidelines: jest.fn(),
  },
}));

import brandProfileApi from '../../services/brandProfileApi';

const mockBrandProfile = {
  id: 'profile-1',
  founderId: 'founder-1',
  name: 'Test Brand',
  description: 'A test brand description',
  tone: 'professional',
  values: ['quality', 'innovation'],
};

describe('useBrandProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console.error for expected errors
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initial fetch', () => {
    it('should fetch brand profile on mount', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({
        brandProfile: mockBrandProfile,
      });

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      expect(result.current.loading).toBe(true);

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(brandProfileApi.getBrandProfileByFounder).toHaveBeenCalledWith('founder-1');
      expect(result.current.brandProfile).toEqual(mockBrandProfile);
      expect(result.current.loading).toBe(false);
    });

    it('should handle API response without brandProfile wrapper', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce(mockBrandProfile);

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.brandProfile).toEqual(mockBrandProfile);
    });

    it('should not fetch if founderId is not provided', async () => {
      const { result } = renderHook(() => useBrandProfile(null, 'session-1'));

      // Give time for any async operations
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      expect(brandProfileApi.getBrandProfileByFounder).not.toHaveBeenCalled();
      expect(result.current.loading).toBe(false);
    });

    it('should handle 404 error gracefully', async () => {
      const error = new Error('404 not found');
      brandProfileApi.getBrandProfileByFounder.mockRejectedValueOnce(error);

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.brandProfile).toBeNull();
      expect(result.current.error).toBeNull();
      expect(result.current.loading).toBe(false);
    });

    it('should set error for other errors', async () => {
      const error = new Error('Network error');
      brandProfileApi.getBrandProfileByFounder.mockRejectedValueOnce(error);

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBe('Network error');
      expect(result.current.loading).toBe(false);
    });
  });

  describe('generateBrandProfile', () => {
    it('should generate brand profile', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({
        brandProfile: null,
      });
      brandProfileApi.generateBrandProfile.mockResolvedValueOnce({
        brandProfile: mockBrandProfile,
      });

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.generateBrandProfile();
      });

      expect(brandProfileApi.generateBrandProfile).toHaveBeenCalledWith({
        founderId: 'founder-1',
        sessionId: 'session-1',
      });
      expect(result.current.brandProfile).toEqual(mockBrandProfile);
      expect(result.current.generating).toBe(false);
    });

    it('should set generating state during operation', async () => {
      let resolveGenerate;
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({ brandProfile: null });
      brandProfileApi.generateBrandProfile.mockImplementation(
        () => new Promise((resolve) => { resolveGenerate = resolve; })
      );

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      let generatePromise;
      act(() => {
        generatePromise = result.current.generateBrandProfile();
      });

      expect(result.current.generating).toBe(true);

      await act(async () => {
        resolveGenerate({ brandProfile: mockBrandProfile });
        await generatePromise;
      });

      expect(result.current.generating).toBe(false);
    });

    it('should throw error if founderId is missing', async () => {
      const { result } = renderHook(() => useBrandProfile(null, 'session-1'));

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await expect(result.current.generateBrandProfile()).rejects.toThrow(
        'Founder ID is required'
      );
    });

    it('should handle generate error', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({ brandProfile: null });
      brandProfileApi.generateBrandProfile.mockRejectedValueOnce(
        new Error('Generation failed')
      );

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        try {
          await result.current.generateBrandProfile();
        } catch (e) {
          expect(e.message).toBe('Generation failed');
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Generation failed');
      });
      expect(result.current.generating).toBe(false);
    });
  });

  describe('updateBrandProfile', () => {
    it('should update brand profile', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({
        brandProfile: mockBrandProfile,
      });
      brandProfileApi.updateBrandProfile.mockResolvedValueOnce({});

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      const updates = { name: 'Updated Brand', tone: 'casual' };

      await act(async () => {
        await result.current.updateBrandProfile(updates);
      });

      expect(brandProfileApi.updateBrandProfile).toHaveBeenCalledWith('founder-1', updates);
      expect(result.current.brandProfile.name).toBe('Updated Brand');
      expect(result.current.brandProfile.tone).toBe('casual');
    });

    it('should throw error if founderId is missing', async () => {
      const { result } = renderHook(() => useBrandProfile(null, 'session-1'));

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await expect(result.current.updateBrandProfile({ name: 'Test' })).rejects.toThrow(
        'Founder ID is required'
      );
    });

    it('should handle update error', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({
        brandProfile: mockBrandProfile,
      });
      brandProfileApi.updateBrandProfile.mockRejectedValueOnce(
        new Error('Update failed')
      );

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        try {
          await result.current.updateBrandProfile({ name: 'Test' });
        } catch (e) {
          expect(e.message).toBe('Update failed');
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Update failed');
      });
    });
  });

  describe('regenerateSection', () => {
    it('should regenerate a section', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({
        brandProfile: mockBrandProfile,
      });
      brandProfileApi.regenerateBrandProfileSection.mockResolvedValueOnce({
        description: 'New regenerated description',
      });

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        await result.current.regenerateSection('description');
      });

      expect(brandProfileApi.regenerateBrandProfileSection).toHaveBeenCalledWith({
        founderId: 'founder-1',
        section: 'description',
      });
      expect(result.current.brandProfile.description).toBe('New regenerated description');
    });

    it('should track regenerating section', async () => {
      let resolveRegenerate;
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({
        brandProfile: mockBrandProfile,
      });
      brandProfileApi.regenerateBrandProfileSection.mockImplementation(
        () => new Promise((resolve) => { resolveRegenerate = resolve; })
      );

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      let regeneratePromise;
      act(() => {
        regeneratePromise = result.current.regenerateSection('description');
      });

      expect(result.current.regeneratingSection).toBe('description');

      await act(async () => {
        resolveRegenerate({ description: 'New' });
        await regeneratePromise;
      });

      expect(result.current.regeneratingSection).toBeNull();
    });

    it('should throw error if founderId is missing', async () => {
      const { result } = renderHook(() => useBrandProfile(null, 'session-1'));

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      await expect(result.current.regenerateSection('description')).rejects.toThrow(
        'Founder ID is required'
      );
    });
  });

  describe('uploadGuidelines', () => {
    it('should upload guidelines', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({
        brandProfile: mockBrandProfile,
      });
      brandProfileApi.uploadBrandGuidelines.mockResolvedValueOnce({
        guidelines: { id: 'guide-1', name: 'Guidelines.pdf' },
      });

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      const mockFile = new File(['content'], 'guidelines.pdf', { type: 'application/pdf' });

      await act(async () => {
        await result.current.uploadGuidelines(mockFile);
      });

      expect(brandProfileApi.uploadBrandGuidelines).toHaveBeenCalledWith('founder-1', mockFile);
      expect(result.current.brandProfile.uploadedGuidelines).toEqual({
        id: 'guide-1',
        name: 'Guidelines.pdf',
      });
    });

    it('should throw error if founderId is missing', async () => {
      const { result } = renderHook(() => useBrandProfile(null, 'session-1'));

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      const mockFile = new File(['content'], 'test.pdf');

      await expect(result.current.uploadGuidelines(mockFile)).rejects.toThrow(
        'Founder ID is required'
      );
    });
  });

  describe('fetchGuidelines', () => {
    it('should fetch guidelines', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({
        brandProfile: mockBrandProfile,
      });
      brandProfileApi.getBrandGuidelines.mockResolvedValueOnce({
        guidelines: { id: 'guide-1', name: 'Guidelines.pdf' },
      });

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      let guidelines;
      await act(async () => {
        guidelines = await result.current.fetchGuidelines();
      });

      expect(brandProfileApi.getBrandGuidelines).toHaveBeenCalledWith('founder-1');
      expect(guidelines).toEqual({ id: 'guide-1', name: 'Guidelines.pdf' });
    });

    it('should return null if founderId is missing', async () => {
      const { result } = renderHook(() => useBrandProfile(null, 'session-1'));

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 0));
      });

      let guidelines;
      await act(async () => {
        guidelines = await result.current.fetchGuidelines();
      });

      expect(guidelines).toBeNull();
    });

    it('should return null on error', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({
        brandProfile: mockBrandProfile,
      });
      brandProfileApi.getBrandGuidelines.mockRejectedValueOnce(new Error('Failed'));

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      let guidelines;
      await act(async () => {
        guidelines = await result.current.fetchGuidelines();
      });

      expect(guidelines).toBeNull();
    });
  });

  describe('deleteGuidelines', () => {
    it('should delete guidelines', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({
        brandProfile: { ...mockBrandProfile, uploadedGuidelines: { id: 'guide-1' } },
      });
      brandProfileApi.deleteBrandGuidelines.mockResolvedValueOnce({});

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.brandProfile.uploadedGuidelines).toBeDefined();

      await act(async () => {
        await result.current.deleteGuidelines('guide-1');
      });

      expect(brandProfileApi.deleteBrandGuidelines).toHaveBeenCalledWith('guide-1');
      expect(result.current.brandProfile.uploadedGuidelines).toBeNull();
    });

    it('should handle delete error', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValueOnce({
        brandProfile: mockBrandProfile,
      });
      brandProfileApi.deleteBrandGuidelines.mockRejectedValueOnce(
        new Error('Delete failed')
      );

      const { result } = renderHook(() =>
        useBrandProfile('founder-1', 'session-1')
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      await act(async () => {
        try {
          await result.current.deleteGuidelines('guide-1');
        } catch (e) {
          expect(e.message).toBe('Delete failed');
        }
      });

      await waitFor(() => {
        expect(result.current.error).toBe('Delete failed');
      });
    });
  });

  describe('refetch on founderId change', () => {
    it('should refetch when founderId changes', async () => {
      brandProfileApi.getBrandProfileByFounder.mockResolvedValue({
        brandProfile: mockBrandProfile,
      });

      const { result, rerender } = renderHook(
        ({ founderId }) => useBrandProfile(founderId, 'session-1'),
        { initialProps: { founderId: 'founder-1' } }
      );

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(brandProfileApi.getBrandProfileByFounder).toHaveBeenCalledTimes(1);

      rerender({ founderId: 'founder-2' });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(brandProfileApi.getBrandProfileByFounder).toHaveBeenCalledTimes(2);
      expect(brandProfileApi.getBrandProfileByFounder).toHaveBeenLastCalledWith('founder-2');
    });
  });
});
