/**
 * LanguageContext Tests
 */
import React from 'react';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '../../context/LanguageContext';

// Mock dependencies
jest.mock('../../core/services/StorageService', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  default: {
    getItem: jest.fn(),
    setItem: jest.fn(),
  },
}));

jest.mock('../../i18n/translations', () => ({
  DEFAULT_LANGUAGE: 'en',
  SUPPORTED_LANGUAGES: [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
  ],
  translations: {
    en: {
      greeting: 'Hello',
      welcome: 'Welcome, {name}!',
      nested: {
        key: 'Nested value',
        deep: {
          value: 'Deep nested',
        },
      },
      multiParam: '{first} and {second}',
    },
    es: {
      greeting: 'Hola',
      welcome: 'Bienvenido, {name}!',
      nested: {
        key: 'Valor anidado',
      },
    },
  },
}));

import storage from '../../core/services/StorageService';

// Test component
function TestComponent() {
  const { language, setLanguage, languages, t } = useLanguage();
  return (
    <div>
      <span data-testid="language">{language}</span>
      <span data-testid="greeting">{t('greeting')}</span>
      <span data-testid="welcome">{t('welcome', { name: 'John' })}</span>
      <span data-testid="nested">{t('nested.key')}</span>
      <span data-testid="deep">{t('nested.deep.value')}</span>
      <span data-testid="missing">{t('missing.key')}</span>
      <span data-testid="languageCount">{languages.length}</span>
      <button onClick={() => setLanguage('es')}>Set Spanish</button>
      <button onClick={() => setLanguage('en')}>Set English</button>
    </div>
  );
}

describe('LanguageContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    storage.getItem.mockReturnValue(null);
  });

  describe('LanguageProvider', () => {
    it('should provide language context to children', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('language')).toHaveTextContent('en');
    });

    it('should initialize from storage if valid language', () => {
      storage.getItem.mockReturnValue('es');

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('language')).toHaveTextContent('es');
    });

    it('should use default language if stored value is invalid', () => {
      storage.getItem.mockReturnValue('invalid');

      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('language')).toHaveTextContent('en');
    });

    it('should provide list of supported languages', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('languageCount')).toHaveTextContent('3');
    });
  });

  describe('t function (translation)', () => {
    it('should translate simple keys', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('greeting')).toHaveTextContent('Hello');
    });

    it('should interpolate parameters', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('welcome')).toHaveTextContent('Welcome, John!');
    });

    it('should access nested keys', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('nested')).toHaveTextContent('Nested value');
    });

    it('should access deeply nested keys', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('deep')).toHaveTextContent('Deep nested');
    });

    it('should return path for missing keys', () => {
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('missing')).toHaveTextContent('missing.key');
    });

    it('should keep placeholders if params are missing', () => {
      function TestMissingParam() {
        const { t } = useLanguage();
        return <span data-testid="result">{t('multiParam', { first: 'A' })}</span>;
      }

      render(
        <LanguageProvider>
          <TestMissingParam />
        </LanguageProvider>
      );

      expect(screen.getByTestId('result')).toHaveTextContent('A and {second}');
    });

    it('should handle non-string template', () => {
      function TestNonString() {
        const { t } = useLanguage();
        // Direct call with undefined
        const result = t('some.undefined.key');
        return <span data-testid="result">{result}</span>;
      }

      render(
        <LanguageProvider>
          <TestNonString />
        </LanguageProvider>
      );

      // Should return the path since key doesn't exist
      expect(screen.getByTestId('result')).toHaveTextContent('some.undefined.key');
    });
  });

  describe('setLanguage', () => {
    it('should change language', async () => {
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      expect(screen.getByTestId('language')).toHaveTextContent('en');
      expect(screen.getByTestId('greeting')).toHaveTextContent('Hello');

      fireEvent.click(screen.getByText('Set Spanish'));

      expect(screen.getByTestId('language')).toHaveTextContent('es');
      expect(screen.getByTestId('greeting')).toHaveTextContent('Hola');
    });

    it('should persist language to storage', async () => {
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      fireEvent.click(screen.getByText('Set Spanish'));

      expect(storage.setItem).toHaveBeenCalledWith('marnee_language', 'es');
    });

    it('should update document.lang attribute', async () => {
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      fireEvent.click(screen.getByText('Set Spanish'));

      expect(document.documentElement.lang).toBe('es');
    });

    it('should use interpolated values in different language', async () => {
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      fireEvent.click(screen.getByText('Set Spanish'));

      expect(screen.getByTestId('welcome')).toHaveTextContent('Bienvenido, John!');
    });

    it('should fallback to default language for missing translations', async () => {
      
      render(
        <LanguageProvider>
          <TestComponent />
        </LanguageProvider>
      );

      fireEvent.click(screen.getByText('Set Spanish'));

      // 'nested.deep.value' doesn't exist in Spanish, should fallback to English
      expect(screen.getByTestId('deep')).toHaveTextContent('Deep nested');
    });
  });

  describe('useLanguage hook', () => {
    it('should throw error when used outside provider', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useLanguage must be used within a LanguageProvider');

      consoleSpy.mockRestore();
    });
  });
});
