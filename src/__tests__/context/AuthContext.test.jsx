/**
 * AuthContext Tests
 */
import React from 'react';
import { render, screen, act, waitFor, fireEvent } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../context/AuthContext';

// Mock dependencies
jest.mock('../../core/services/StorageService', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeMultiple: jest.fn(),
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeMultiple: jest.fn(),
  },
}));

jest.mock('../../core/utils/auth', () => ({
  isAuthenticated: jest.fn(),
  getAuthSession: jest.fn(),
}));

import storage from '../../core/services/StorageService';
import { isAuthenticated, getAuthSession } from '../../core/utils/auth';

// Test component that uses the hook
function TestComponent({ onRender }) {
  const auth = useAuth();
  if (onRender) onRender(auth);
  return (
    <div>
      <span data-testid="user">{auth.user?.name || 'no user'}</span>
      <span data-testid="founderId">{auth.founderId || 'no founderId'}</span>
      <span data-testid="sessionId">{auth.sessionId || 'no sessionId'}</span>
      <span data-testid="isAuth">{auth.isAuthenticated ? 'yes' : 'no'}</span>
      <span data-testid="hasSession">{auth.hasSession ? 'yes' : 'no'}</span>
      <button onClick={() => auth.login({ founderId: 'f123', sessionId: 's456', user: { name: 'Test' } })}>
        Login
      </button>
      <button onClick={() => auth.logout()}>Logout</button>
      <button onClick={() => auth.setFounderId('newFounder')}>Set Founder</button>
      <button onClick={() => auth.setUser({ name: 'Updated' })}>Set User</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getItem.mockReturnValue(null);
    getAuthSession.mockReturnValue(null);
    isAuthenticated.mockReturnValue(false);
  });

  describe('AuthProvider', () => {
    it('should provide auth context to children', () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user')).toHaveTextContent('no user');
    });

    it('should initialize founderId from storage', () => {
      storage.getItem.mockImplementation((key) => {
        if (key === 'marnee_founderId') return 'stored-founder';
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('founderId')).toHaveTextContent('stored-founder');
    });

    it('should initialize sessionId from storage', () => {
      storage.getItem.mockImplementation((key) => {
        if (key === 'marnee_sessionId') return 'stored-session';
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('sessionId')).toHaveTextContent('stored-session');
    });

    it('should initialize user from auth session', () => {
      getAuthSession.mockReturnValue({ user: { name: 'John' } });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('user')).toHaveTextContent('John');
    });

    it('should reflect isAuthenticated state', () => {
      isAuthenticated.mockReturnValue(true);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('isAuth')).toHaveTextContent('yes');
    });

    it('should show hasSession when founderId and sessionId exist', () => {
      storage.getItem.mockImplementation((key) => {
        if (key === 'marnee_founderId') return 'f1';
        if (key === 'marnee_sessionId') return 's1';
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('hasSession')).toHaveTextContent('yes');
    });
  });

  describe('login', () => {
    it('should update state on login', async () => {
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Login'));

      expect(screen.getByTestId('founderId')).toHaveTextContent('f123');
      expect(screen.getByTestId('sessionId')).toHaveTextContent('s456');
      expect(screen.getByTestId('user')).toHaveTextContent('Test');
    });

    it('should persist founderId to storage', async () => {
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(storage.setItem).toHaveBeenCalledWith('marnee_founderId', 'f123');
      });
    });

    it('should persist sessionId to storage', async () => {
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Login'));

      await waitFor(() => {
        expect(storage.setItem).toHaveBeenCalledWith('marnee_sessionId', 's456');
      });
    });
  });

  describe('logout', () => {
    it('should clear state on logout', async () => {
            storage.getItem.mockImplementation((key) => {
        if (key === 'marnee_founderId') return 'f1';
        if (key === 'marnee_sessionId') return 's1';
        return null;
      });
      getAuthSession.mockReturnValue({ user: { name: 'John' } });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      // Verify initial state
      expect(screen.getByTestId('founderId')).toHaveTextContent('f1');

      fireEvent.click(screen.getByText('Logout'));

      expect(screen.getByTestId('founderId')).toHaveTextContent('no founderId');
      expect(screen.getByTestId('sessionId')).toHaveTextContent('no sessionId');
      expect(screen.getByTestId('user')).toHaveTextContent('no user');
    });

    it('should remove items from storage', async () => {
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Logout'));

      expect(storage.removeMultiple).toHaveBeenCalledWith([
        'marnee_founderId',
        'marnee_sessionId',
        'authSession',
      ]);
    });

    it('should dispatch app-logout event', async () => {
            const eventHandler = jest.fn();
      window.addEventListener('app-logout', eventHandler);

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Logout'));

      expect(eventHandler).toHaveBeenCalled();

      window.removeEventListener('app-logout', eventHandler);
    });
  });

  describe('setFounderId', () => {
    it('should update founderId', async () => {
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Set Founder'));

      expect(screen.getByTestId('founderId')).toHaveTextContent('newFounder');
    });
  });

  describe('setUser', () => {
    it('should update user', async () => {
      
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      fireEvent.click(screen.getByText('Set User'));

      expect(screen.getByTestId('user')).toHaveTextContent('Updated');
    });
  });

  describe('app-logout event listener', () => {
    it('should clear state when app-logout event is dispatched', async () => {
      storage.getItem.mockImplementation((key) => {
        if (key === 'marnee_founderId') return 'f1';
        if (key === 'marnee_sessionId') return 's1';
        return null;
      });

      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );

      expect(screen.getByTestId('founderId')).toHaveTextContent('f1');

      // Dispatch event from outside
      await act(async () => {
        window.dispatchEvent(new Event('app-logout'));
      });

      expect(screen.getByTestId('founderId')).toHaveTextContent('no founderId');
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });
  });
});
