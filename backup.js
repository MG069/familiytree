class BackupManager {
  constructor() {
    this._maxBackups = 10;
    this._backupKey = 'familyTreeBackups';
    logger.info('BackupManager', 'Initialized');
  }

  /**
   * Creates backup of current family tree data
   */
  createBackup() {
    const data = localStorage.getItem('familyTree');
    if (!data) {
      console.log('BackupManager: No data to backup');
      return;
    }

    const backups = this.getBackups();
    const backup = {
      timestamp: Date.now(),
      date: new Date().toISOString(),
      data: data,
      size: (data.length / 1024).toFixed(2) + ' KB'
    };

    backups.push(backup);

    if (backups.length > this._maxBackups) {
      backups.shift();
      console.log('BackupManager: Removed oldest backup');
    }

    localStorage.setItem(this._backupKey, JSON.stringify(backups));
    console.log('BackupManager: Backup created', backup.date);
    logger.info('BackupManager', 'Backup created', { date: backup.date, size: backup.size });
  }

  /**
   * Gets all backups
   * @returns {Array} Array of backups
   */
  getBackups() {
    const stored = localStorage.getItem(this._backupKey);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Restores backup by index
   * @param {number} index - Backup index
   */
  restoreBackup(index) {
    const backups = this.getBackups();
    if (index < 0 || index >= backups.length) {
      console.error('BackupManager: Invalid backup index');
      return false;
    }

    const backup = backups[index];
    localStorage.setItem('familyTree', backup.data);
    console.log('BackupManager: Backup restored', backup.date);
    logger.info('BackupManager', 'Backup restored', { date: backup.date });
    return true;
  }

  /**
   * Deletes backup by index
   * @param {number} index - Backup index
   */
  deleteBackup(index) {
    const backups = this.getBackups();
    if (index < 0 || index >= backups.length) {
      console.error('BackupManager: Invalid backup index');
      return false;
    }

    const deleted = backups.splice(index, 1)[0];
    localStorage.setItem(this._backupKey, JSON.stringify(backups));
    console.log('BackupManager: Backup deleted', deleted.date);
    logger.info('BackupManager', 'Backup deleted', { date: deleted.date });
    return true;
  }

  /**
   * Exports backup as JSON file
   * @param {number} index - Backup index
   */
  exportBackup(index) {
    const backups = this.getBackups();
    if (index < 0 || index >= backups.length) {
      console.error('BackupManager: Invalid backup index');
      return;
    }

    const backup = backups[index];
    const blob = new Blob([backup.data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `family-tree-backup-${new Date(backup.timestamp).toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    logger.info('BackupManager', 'Backup exported', { date: backup.date });
  }

  /**
   * Clears all backups
   */
  clearAllBackups() {
    localStorage.removeItem(this._backupKey);
    console.log('BackupManager: All backups cleared');
    logger.info('BackupManager', 'All backups cleared');
  }
}

const backupManager = new BackupManager();
