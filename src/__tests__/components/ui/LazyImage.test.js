/**
 * LazyImage Component Tests
 */

import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import LazyImage, { preloadImage } from '../../../Component/ui/LazyImage';

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

beforeEach(() => {
  mockIntersectionObserver.mockImplementation((callback) => ({
    observe: mockObserve,
    unobserve: mockUnobserve,
    disconnect: mockDisconnect,
  }));
  window.IntersectionObserver = mockIntersectionObserver;
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('LazyImage', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
    alt: 'Test image',
  };

  describe('rendering', () => {
    it('should render without crashing', () => {
      render(<LazyImage {...defaultProps} />);
      // Should render a container div
      expect(document.querySelector('div')).toBeInTheDocument();
    });

    it('should show placeholder initially', () => {
      render(<LazyImage {...defaultProps} />);
      // Placeholder div should be visible (opacity: 1)
      const placeholder = document.querySelector('div > div');
      expect(placeholder).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <LazyImage {...defaultProps} className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('should apply custom styles', () => {
      const { container } = render(
        <LazyImage {...defaultProps} style={{ width: '200px', height: '200px' }} />
      );
      expect(container.firstChild).toHaveStyle({ width: '200px', height: '200px' });
    });
  });

  describe('IntersectionObserver', () => {
    it('should create IntersectionObserver on mount', () => {
      render(<LazyImage {...defaultProps} />);
      expect(mockIntersectionObserver).toHaveBeenCalled();
    });

    it('should observe the image element', () => {
      render(<LazyImage {...defaultProps} />);
      expect(mockObserve).toHaveBeenCalled();
    });

    it('should disconnect observer on unmount', () => {
      const { unmount } = render(<LazyImage {...defaultProps} />);
      unmount();
      expect(mockDisconnect).toHaveBeenCalled();
    });

    it('should use custom threshold', () => {
      render(<LazyImage {...defaultProps} threshold={0.5} />);
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ threshold: 0.5 })
      );
    });

    it('should use custom rootMargin', () => {
      render(<LazyImage {...defaultProps} rootMargin="100px" />);
      expect(mockIntersectionObserver).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({ rootMargin: '100px' })
      );
    });
  });

  describe('when image enters viewport', () => {
    it('should render img element when intersecting', async () => {
      // Simulate intersection
      mockIntersectionObserver.mockImplementation((callback) => {
        // Immediately trigger intersection
        setTimeout(() => {
          callback([{ isIntersecting: true, target: document.createElement('div') }]);
        }, 0);
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
        };
      });

      render(<LazyImage {...defaultProps} />);

      await waitFor(() => {
        const img = document.querySelector('img');
        expect(img).toBeInTheDocument();
      });
    });
  });

  describe('image loading', () => {
    it('should have loading="lazy" attribute', async () => {
      // Simulate image in view
      mockIntersectionObserver.mockImplementation((callback) => {
        setTimeout(() => {
          callback([{ isIntersecting: true, target: document.createElement('div') }]);
        }, 0);
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
        };
      });

      render(<LazyImage {...defaultProps} />);

      await waitFor(() => {
        const img = document.querySelector('img');
        expect(img).toHaveAttribute('loading', 'lazy');
      });
    });

    it('should have decoding="async" attribute', async () => {
      mockIntersectionObserver.mockImplementation((callback) => {
        setTimeout(() => {
          callback([{ isIntersecting: true, target: document.createElement('div') }]);
        }, 0);
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
        };
      });

      render(<LazyImage {...defaultProps} />);

      await waitFor(() => {
        const img = document.querySelector('img');
        expect(img).toHaveAttribute('decoding', 'async');
      });
    });

    it('should call onLoad callback when image loads', async () => {
      const onLoadMock = jest.fn();

      mockIntersectionObserver.mockImplementation((callback) => {
        setTimeout(() => {
          callback([{ isIntersecting: true, target: document.createElement('div') }]);
        }, 0);
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
        };
      });

      render(<LazyImage {...defaultProps} onLoad={onLoadMock} />);

      await waitFor(() => {
        const img = document.querySelector('img');
        expect(img).toBeInTheDocument();
      });

      const img = document.querySelector('img');
      fireEvent.load(img);

      expect(onLoadMock).toHaveBeenCalled();
    });

    it('should call onError callback when image fails to load', async () => {
      const onErrorMock = jest.fn();

      mockIntersectionObserver.mockImplementation((callback) => {
        setTimeout(() => {
          callback([{ isIntersecting: true, target: document.createElement('div') }]);
        }, 0);
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
        };
      });

      render(<LazyImage {...defaultProps} onError={onErrorMock} />);

      await waitFor(() => {
        const img = document.querySelector('img');
        expect(img).toBeInTheDocument();
      });

      const img = document.querySelector('img');
      fireEvent.error(img);

      expect(onErrorMock).toHaveBeenCalled();
    });

    it('should use fallbackSrc when image fails to load', async () => {
      const fallbackSrc = 'https://example.com/fallback.jpg';

      mockIntersectionObserver.mockImplementation((callback) => {
        setTimeout(() => {
          callback([{ isIntersecting: true, target: document.createElement('div') }]);
        }, 0);
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
        };
      });

      render(<LazyImage {...defaultProps} fallbackSrc={fallbackSrc} />);

      await waitFor(() => {
        const img = document.querySelector('img');
        expect(img).toBeInTheDocument();
      });

      const img = document.querySelector('img');
      fireEvent.error(img);

      await waitFor(() => {
        expect(img).toHaveAttribute('src', fallbackSrc);
      });
    });
  });

  describe('custom placeholder', () => {
    it('should render custom placeholder', () => {
      const customPlaceholder = <div data-testid="custom-placeholder">Loading...</div>;

      render(<LazyImage {...defaultProps} placeholder={customPlaceholder} />);

      expect(screen.getByTestId('custom-placeholder')).toBeInTheDocument();
    });
  });

  describe('srcSet and sizes', () => {
    it('should pass srcSet attribute to img', async () => {
      const srcSet = 'image-300.jpg 300w, image-600.jpg 600w';

      mockIntersectionObserver.mockImplementation((callback) => {
        setTimeout(() => {
          callback([{ isIntersecting: true, target: document.createElement('div') }]);
        }, 0);
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
        };
      });

      render(<LazyImage {...defaultProps} srcSet={srcSet} />);

      await waitFor(() => {
        const img = document.querySelector('img');
        expect(img).toHaveAttribute('srcset', srcSet);
      });
    });

    it('should pass sizes attribute to img', async () => {
      const sizes = '(max-width: 600px) 300px, 600px';

      mockIntersectionObserver.mockImplementation((callback) => {
        setTimeout(() => {
          callback([{ isIntersecting: true, target: document.createElement('div') }]);
        }, 0);
        return {
          observe: mockObserve,
          unobserve: mockUnobserve,
          disconnect: mockDisconnect,
        };
      });

      render(<LazyImage {...defaultProps} sizes={sizes} />);

      await waitFor(() => {
        const img = document.querySelector('img');
        expect(img).toHaveAttribute('sizes', sizes);
      });
    });
  });
});

describe('preloadImage', () => {
  let mockImage;

  beforeEach(() => {
    mockImage = {
      onload: null,
      onerror: null,
      src: '',
    };

    jest.spyOn(global, 'Image').mockImplementation(() => mockImage);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should resolve when image loads successfully', async () => {
    const src = 'https://example.com/image.jpg';

    const promise = preloadImage(src);

    // Simulate successful load
    mockImage.onload();

    await expect(promise).resolves.toBe(mockImage);
    expect(mockImage.src).toBe(src);
  });

  it('should reject when image fails to load', async () => {
    const src = 'https://example.com/invalid.jpg';
    const error = new Error('Failed to load');

    const promise = preloadImage(src);

    // Simulate load error
    mockImage.onerror(error);

    await expect(promise).rejects.toBe(error);
  });
});
