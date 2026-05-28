/**
 * Logger Tests
 */
import { Logger, LOG_LEVELS } from '../../../core/utils/logger';

describe('Logger', () => {
  let logger;
  let consoleSpy;

  beforeEach(() => {
    logger = new Logger();
    consoleSpy = {
      debug: jest.spyOn(console, 'debug').mockImplementation(),
      log: jest.spyOn(console, 'log').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
      group: jest.spyOn(console, 'group').mockImplementation(),
      groupEnd: jest.spyOn(console, 'groupEnd').mockImplementation(),
      table: jest.spyOn(console, 'table').mockImplementation(),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('LOG_LEVELS', () => {
    it('should have correct log levels', () => {
      expect(LOG_LEVELS.DEBUG).toBe(0);
      expect(LOG_LEVELS.INFO).toBe(1);
      expect(LOG_LEVELS.WARN).toBe(2);
      expect(LOG_LEVELS.ERROR).toBe(3);
      expect(LOG_LEVELS.NONE).toBe(4);
    });
  });

  describe('constructor', () => {
    it('should set level based on NODE_ENV', () => {
      // In test environment, it defaults to DEBUG
      expect(logger.level).toBe(LOG_LEVELS.DEBUG);
    });

    it('should enable timestamps by default', () => {
      expect(logger.enableTimestamps).toBe(true);
    });

    it('should enable context by default', () => {
      expect(logger.enableContext).toBe(true);
    });
  });

  describe('setLevel', () => {
    it('should set log level', () => {
      logger.setLevel('error');
      expect(logger.level).toBe(LOG_LEVELS.ERROR);
    });

    it('should be case insensitive', () => {
      logger.setLevel('WARN');
      expect(logger.level).toBe(LOG_LEVELS.WARN);

      logger.setLevel('Info');
      expect(logger.level).toBe(LOG_LEVELS.INFO);
    });

    it('should ignore invalid levels', () => {
      const originalLevel = logger.level;
      logger.setLevel('invalid');
      expect(logger.level).toBe(originalLevel);
    });
  });

  describe('getTimestamp', () => {
    it('should return ISO timestamp', () => {
      const timestamp = logger.getTimestamp();
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });

  describe('formatMessage', () => {
    it('should include timestamp and context', () => {
      const message = logger.formatMessage('TestContext', 'Test message');

      expect(message).toContain('[TestContext]');
      expect(message).toContain('Test message');
      // Should contain timestamp in ISO format
      expect(message).toMatch(/\[\d{4}-\d{2}-\d{2}T/);
    });

    it('should exclude timestamp when disabled', () => {
      logger.enableTimestamps = false;
      const message = logger.formatMessage('Context', 'Message');

      expect(message).not.toMatch(/\[\d{4}-\d{2}-\d{2}T/);
      expect(message).toContain('[Context]');
    });

    it('should exclude context when disabled', () => {
      logger.enableContext = false;
      const message = logger.formatMessage('Context', 'Message');

      expect(message).not.toContain('[Context]');
    });

    it('should handle empty context', () => {
      const message = logger.formatMessage('', 'Message');
      expect(message).toContain('Message');
    });
  });

  describe('debug', () => {
    it('should log debug message when level is DEBUG', () => {
      logger.setLevel('debug');
      logger.debug('TestContext', 'Debug message');

      expect(consoleSpy.debug).toHaveBeenCalled();
    });

    it('should not log debug when level is higher', () => {
      logger.setLevel('info');
      logger.debug('TestContext', 'Debug message');

      expect(consoleSpy.debug).not.toHaveBeenCalled();
    });

    it('should pass additional arguments', () => {
      logger.setLevel('debug');
      logger.debug('Context', 'Message', { extra: 'data' });

      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.any(String),
        { extra: 'data' }
      );
    });
  });

  describe('info', () => {
    it('should log info message when level allows', () => {
      logger.setLevel('info');
      logger.info('Context', 'Info message');

      expect(consoleSpy.log).toHaveBeenCalled();
    });

    it('should not log info when level is higher', () => {
      logger.setLevel('warn');
      logger.info('Context', 'Info message');

      expect(consoleSpy.log).not.toHaveBeenCalled();
    });
  });

  describe('warn', () => {
    it('should log warning message when level allows', () => {
      logger.setLevel('warn');
      logger.warn('Context', 'Warning message');

      expect(consoleSpy.warn).toHaveBeenCalled();
    });

    it('should not log warn when level is ERROR', () => {
      logger.setLevel('error');
      logger.warn('Context', 'Warning message');

      expect(consoleSpy.warn).not.toHaveBeenCalled();
    });
  });

  describe('error', () => {
    it('should log error message when level allows', () => {
      logger.setLevel('error');
      logger.error('Context', 'Error message');

      expect(consoleSpy.error).toHaveBeenCalled();
    });

    it('should not log error when level is NONE', () => {
      logger.setLevel('none');
      logger.error('Context', 'Error message');

      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it('should pass error objects', () => {
      logger.setLevel('error');
      const error = new Error('Test error');
      logger.error('Context', 'Error occurred', error);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.any(String),
        error
      );
    });
  });

  describe('createContextLogger', () => {
    it('should create a logger with preset context', () => {
      logger.setLevel('debug');
      const contextLog = logger.createContextLogger('MyComponent');

      contextLog.debug('Debug message');
      contextLog.info('Info message');
      contextLog.warn('Warn message');
      contextLog.error('Error message');

      expect(consoleSpy.debug).toHaveBeenCalled();
      expect(consoleSpy.log).toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalled();

      // Check that context is included
      expect(consoleSpy.debug.mock.calls[0][0]).toContain('[MyComponent]');
    });

    it('should pass additional arguments', () => {
      logger.setLevel('debug');
      const contextLog = logger.createContextLogger('Context');

      contextLog.debug('Message', { data: 'value' });

      expect(consoleSpy.debug).toHaveBeenCalledWith(
        expect.stringContaining('[Context]'),
        { data: 'value' }
      );
    });
  });

  describe('group', () => {
    it('should call console.group when level allows', () => {
      logger.setLevel('debug');
      logger.group('Test Group');

      expect(consoleSpy.group).toHaveBeenCalledWith('Test Group');
    });

    it('should not call console.group when level is too high', () => {
      logger.setLevel('info');
      logger.group('Test Group');

      expect(consoleSpy.group).not.toHaveBeenCalled();
    });
  });

  describe('groupEnd', () => {
    it('should call console.groupEnd when level allows', () => {
      logger.setLevel('debug');
      logger.groupEnd();

      expect(consoleSpy.groupEnd).toHaveBeenCalled();
    });

    it('should not call console.groupEnd when level is too high', () => {
      logger.setLevel('info');
      logger.groupEnd();

      expect(consoleSpy.groupEnd).not.toHaveBeenCalled();
    });
  });

  describe('table', () => {
    it('should call console.table when level allows', () => {
      logger.setLevel('debug');
      const data = [{ a: 1 }, { a: 2 }];
      logger.table(data);

      expect(consoleSpy.table).toHaveBeenCalledWith(data);
    });

    it('should not call console.table when level is too high', () => {
      logger.setLevel('info');
      logger.table([{ a: 1 }]);

      expect(consoleSpy.table).not.toHaveBeenCalled();
    });
  });

  describe('integration', () => {
    it('should respect log level hierarchy', () => {
      logger.setLevel('warn');

      logger.debug('Context', 'Debug');
      logger.info('Context', 'Info');
      logger.warn('Context', 'Warn');
      logger.error('Context', 'Error');

      expect(consoleSpy.debug).not.toHaveBeenCalled();
      expect(consoleSpy.log).not.toHaveBeenCalled();
      expect(consoleSpy.warn).toHaveBeenCalled();
      expect(consoleSpy.error).toHaveBeenCalled();
    });
  });
});
