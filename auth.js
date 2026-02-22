class Auth {
  constructor() {
    this._tokenKey = 'familyTreeToken';
    this._tokenDuration = 24 * 60 * 60 * 1000;
    logger.info('Auth', 'Initialized');
  }

  /**
   * Validates password and generates token
   * @param {string} password - Password
   * @returns {Promise<boolean>} Authentication success
   */
  async login(password) {
    const hash = await this._hashPassword(password);
    const validHash = '482b076b5cb9d58f90126b6f842a9b95556c2cffcac13e821157128d2bcae9f2';
    
    if (hash === validHash) {
      const token = this._generateToken();
      const expiry = Date.now() + this._tokenDuration;
      
      localStorage.setItem(this._tokenKey, JSON.stringify({
        token,
        expiry
      }));
      
      console.log('Auth: Token saved to localStorage');
      logger.info('Auth', 'Login successful');
      
      if (typeof backupManager !== 'undefined') {
        backupManager.createBackup();
      }
      
      return true;
    }
    
    console.log('Auth: Login failed - invalid password');
    logger.warn('Auth', 'Login failed - invalid credentials');
    return false;
  }

  /**
   * Creates SHA-256 hash of password
   * @param {string} password - Password to hash
   * @returns {Promise<string>} Hex hash string
   */
  async _hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Checks if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const data = localStorage.getItem(this._tokenKey);
    
    if (!data) {
      console.log('Auth: No token found in localStorage');
      logger.info('Auth', 'No token found');
      return false;
    }
    
    try {
      const { token, expiry } = JSON.parse(data);
      
      if (!token || !expiry) {
        console.log('Auth: Invalid token data');
        logger.warn('Auth', 'Invalid token data');
        return false;
      }
      
      if (Date.now() > expiry) {
        console.log('Auth: Token expired');
        logger.info('Auth', 'Token expired');
        this.logout();
        return false;
      }
      
      console.log('Auth: Token valid, expiry:', new Date(expiry));
      logger.info('Auth', 'Token valid');
      return true;
    } catch (error) {
      console.log('Auth: Token validation error', error);
      logger.error('Auth', 'Token validation error', error);
      return false;
    }
  }

  /**
   * Logs out user
   */
  logout() {
    localStorage.removeItem(this._tokenKey);
    logger.info('Auth', 'Logged out');
    window.location.href = 'login.html';
  }

  /**
   * Generates authentication token
   * @returns {string} Generated token
   */
  _generateToken() {
    return btoa(Date.now() + Math.random().toString(36));
  }

  /**
   * Gets remaining token time in minutes
   * @returns {number} Minutes until expiry
   */
  getRemainingTime() {
    const data = localStorage.getItem(this._tokenKey);
    if (!data) return 0;
    
    try {
      const { expiry } = JSON.parse(data);
      const remaining = expiry - Date.now();
      return Math.max(0, Math.floor(remaining / 60000));
    } catch {
      return 0;
    }
  }
}

const auth = new Auth();
