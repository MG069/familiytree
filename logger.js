class Logger {
  constructor() {
    this._logs = [];
    this._maxLogs = 1000;
    console.log('[Logger] Initialized');
  }

  /**
   * Logs an info message
   * @param {string} category - Log category
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  info(category, message, data = null) {
    this._log('INFO', category, message, data);
  }

  /**
   * Logs a warning message
   * @param {string} category - Log category
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  warn(category, message, data = null) {
    this._log('WARN', category, message, data);
  }

  /**
   * Logs an error message
   * @param {string} category - Log category
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  error(category, message, data = null) {
    this._log('ERROR', category, message, data);
  }

  /**
   * Internal logging method
   * @param {string} level - Log level
   * @param {string} category - Log category
   * @param {string} message - Log message
   * @param {Object} data - Additional data
   */
  _log(level, category, message, data) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      category,
      message,
      data
    };

    this._logs.push(logEntry);

    if (this._logs.length > this._maxLogs) {
      this._logs.shift();
    }

    const consoleMsg = `[${timestamp}] [${level}] [${category}] ${message}`;
    
    if (level === 'ERROR') {
      console.error(consoleMsg, data || '');
    } else if (level === 'WARN') {
      console.warn(consoleMsg, data || '');
    } else {
      console.log(consoleMsg, data || '');
    }

    this._saveToLocalStorage();
  }

  /**
   * Saves logs to localStorage
   */
  _saveToLocalStorage() {
    try {
      localStorage.setItem('familyTreeLogs', JSON.stringify(this._logs));
    } catch (e) {
      console.error('[Logger] Failed to save logs to localStorage', e);
    }
  }

  /**
   * Loads logs from localStorage
   */
  loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('familyTreeLogs');
      if (stored) {
        this._logs = JSON.parse(stored);
        console.log('[Logger] Loaded logs from localStorage');
      }
    } catch (e) {
      console.error('[Logger] Failed to load logs from localStorage', e);
    }
  }

  /**
   * Gets all logs
   * @returns {Array} Array of log entries
   */
  getLogs() {
    return [...this._logs];
  }

  /**
   * Exports logs as JSON
   * @returns {string} JSON string of logs
   */
  exportLogs() {
    return JSON.stringify(this._logs, null, 2);
  }

  /**
   * Clears all logs
   */
  clear() {
    this._logs = [];
    localStorage.removeItem('familyTreeLogs');
    console.log('[Logger] Logs cleared');
  }
}

const logger = new Logger();
logger.loadFromLocalStorage();
