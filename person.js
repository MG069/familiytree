class Person {
  constructor(id, firstName, lastName, gender = 'male') {
    this._id = id;
    this._firstName = firstName;
    this._lastName = lastName;
    this._gender = gender;
    this._birthday = null;
    this._deathday = null;
    this._photo = null;
    this._info = '';
    this._files = [];
    this._dataLink = '';
    this._x = 100;
    this._y = 100;
    this._mother = null;
    this._father = null;
    this._children = [];
    this._spouses = [];
    logger.info('Person', `Created person: ${firstName} ${lastName} (${gender})`, { id });
  }

  /**
   * Gets person ID
   * @returns {string} Person ID
   */
  getId() {
    return this._id;
  }

  /**
   * Gets first name
   * @returns {string} First name
   */
  getFirstName() {
    return this._firstName;
  }

  /**
   * Sets first name
   * @param {string} firstName - First name
   */
  setFirstName(firstName) {
    this._firstName = firstName;
    logger.info('Person', `Updated first name for ${this._id}`, { firstName });
  }

  /**
   * Gets last name
   * @returns {string} Last name
   */
  getLastName() {
    return this._lastName;
  }

  /**
   * Sets last name
   * @param {string} lastName - Last name
   */
  setLastName(lastName) {
    this._lastName = lastName;
    logger.info('Person', `Updated last name for ${this._id}`, { lastName });
  }

  /**
   * Gets full name
   * @returns {string} Full name
   */
  getFullName() {
    return `${this._firstName} ${this._lastName}`;
  }

  /**
   * Gets gender
   * @returns {string} Gender
   */
  getGender() {
    return this._gender || 'male';
  }

  /**
   * Sets gender
   * @param {string} gender - Gender (male/female)
   */
  setGender(gender) {
    this._gender = gender;
    logger.info('Person', `Updated gender for ${this._id}`, { gender });
  }

  /**
   * Gets birthday
   * @returns {string} Birthday
   */
  getBirthday() {
    return this._birthday;
  }

  /**
   * Sets birthday
   * @param {string} birthday - Birthday
   */
  setBirthday(birthday) {
    this._birthday = birthday;
  }

  /**
   * Gets death day
   * @returns {string} Death day
   */
  getDeathday() {
    return this._deathday;
  }

  /**
   * Sets death day
   * @param {string} deathday - Death day
   */
  setDeathday(deathday) {
    this._deathday = deathday;
  }

  /**
   * Gets photo
   * @returns {string} Photo data URL
   */
  getPhoto() {
    return this._photo;
  }

  /**
   * Sets photo
   * @param {string} photo - Photo data URL
   */
  setPhoto(photo) {
    this._photo = photo;
  }

  /**
   * Gets info
   * @returns {string} Info text
   */
  getInfo() {
    return this._info;
  }

  /**
   * Sets info
   * @param {string} info - Info text
   */
  setInfo(info) {
    this._info = info;
  }

  /**
   * Gets data link
   * @returns {string} Data link URL
   */
  getDataLink() {
    return this._dataLink;
  }

  /**
   * Sets data link
   * @param {string} dataLink - Data link URL
   */
  setDataLink(dataLink) {
    this._dataLink = dataLink;
    logger.info('Person', `Updated data link for ${this._id}`, { dataLink });
  }

  /**
   * Gets files
   * @returns {Array} Array of files
   */
  getFiles() {
    return this._files;
  }

  /**
   * Adds file
   * @param {Object} file - File object
   */
  addFile(file) {
    this._files.push(file);
    logger.info('Person', `Added file for ${this._id}`, { fileName: file.name });
  }

  /**
   * Removes file at index
   * @param {number} index - File index
   */
  removeFile(index) {
    if (index >= 0 && index < this._files.length) {
      const removedFile = this._files.splice(index, 1)[0];
      logger.info('Person', `Removed file for ${this._id}`, { fileName: removedFile.name });
    }
  }

  /**
   * Sets files
   * @param {Array} files - Array of files
   */
  setFiles(files) {
    this._files = files;
  }

  /**
   * Gets X position
   * @returns {number} X coordinate
   */
  getX() {
    return this._x;
  }

  /**
   * Sets X position
   * @param {number} x - X coordinate
   */
  setX(x) {
    this._x = x;
  }

  /**
   * Gets Y position
   * @returns {number} Y coordinate
   */
  getY() {
    return this._y;
  }

  /**
   * Sets Y position
   * @param {number} y - Y coordinate
   */
  setY(y) {
    this._y = y;
  }

  /**
   * Gets mother ID
   * @returns {string} Mother ID
   */
  getMother() {
    return this._mother;
  }

  /**
   * Sets mother
   * @param {string} motherId - Mother ID
   */
  setMother(motherId) {
    this._mother = motherId;
    logger.info('Person', `Set mother for ${this._id}`, { motherId });
  }

  /**
   * Gets father ID
   * @returns {string} Father ID
   */
  getFather() {
    return this._father;
  }

  /**
   * Sets father
   * @param {string} fatherId - Father ID
   */
  setFather(fatherId) {
    this._father = fatherId;
    logger.info('Person', `Set father for ${this._id}`, { fatherId });
  }

  /**
   * Gets parents (for backwards compatibility)
   * @returns {Array} Array of parent IDs
   */
  getParents() {
    const parents = [];
    if (this._mother) parents.push(this._mother);
    if (this._father) parents.push(this._father);
    return parents;
  }

  /**
   * Adds parent (for backwards compatibility)
   * @param {string} parentId - Parent ID
   */
  addParent(parentId) {
    logger.info('Person', `addParent called - use setMother/setFather instead`, { parentId });
  }

  /**
   * Removes parent (for backwards compatibility)
   * @param {string} parentId - Parent ID
   */
  removeParent(parentId) {
    if (this._mother === parentId) this._mother = null;
    if (this._father === parentId) this._father = null;
    logger.info('Person', `Removed parent from ${this._id}`, { parentId });
  }

  /**
   * Gets children
   * @returns {Array} Array of child IDs
   */
  getChildren() {
    return this._children;
  }

  /**
   * Adds child
   * @param {string} childId - Child ID
   */
  addChild(childId) {
    if (!this._children.includes(childId)) {
      this._children.push(childId);
      logger.info('Person', `Added child to ${this._id}`, { childId });
    }
  }

  /**
   * Removes child
   * @param {string} childId - Child ID
   */
  removeChild(childId) {
    this._children = this._children.filter(id => id !== childId);
    logger.info('Person', `Removed child from ${this._id}`, { childId });
  }

  /**
   * Gets spouses
   * @returns {Array} Array of spouse IDs
   */
  getSpouses() {
    return this._spouses;
  }

  /**
   * Adds spouse
   * @param {string} spouseId - Spouse ID
   */
  addSpouse(spouseId) {
    if (!this._spouses.includes(spouseId)) {
      this._spouses.push(spouseId);
      logger.info('Person', `Added spouse to ${this._id}`, { spouseId });
    }
  }

  /**
   * Removes spouse
   * @param {string} spouseId - Spouse ID
   */
  removeSpouse(spouseId) {
    this._spouses = this._spouses.filter(id => id !== spouseId);
    logger.info('Person', `Removed spouse from ${this._id}`, { spouseId });
  }

  /**
   * Converts person to JSON
   * @returns {Object} JSON representation
   */
  toJSON() {
    return {
      id: this._id,
      firstName: this._firstName,
      lastName: this._lastName,
      gender: this._gender,
      birthday: this._birthday,
      deathday: this._deathday,
      photo: this._photo,
      info: this._info,
      files: this._files,
      dataLink: this._dataLink,
      x: this._x,
      y: this._y,
      mother: this._mother,
      father: this._father,
      children: this._children,
      spouses: this._spouses
    };
  }

  /**
   * Creates person from JSON
   * @param {Object} json - JSON data
   * @returns {Person} Person instance
   */
  static fromJSON(json) {
    const person = new Person(json.id, json.firstName, json.lastName, json.gender || 'male');
    person.setBirthday(json.birthday);
    person.setDeathday(json.deathday);
    person.setPhoto(json.photo);
    person.setInfo(json.info);
    person.setFiles(json.files || []);
    person.setDataLink(json.dataLink || '');
    person.setX(json.x);
    person.setY(json.y);
    person._mother = json.mother || null;
    person._father = json.father || null;
    person._children = json.children || [];
    person._spouses = json.spouses || [];
    
    if (json.parents && json.parents.length > 0 && !json.mother && !json.father) {
      person._mother = json.parents[0];
      if (json.parents.length > 1) {
        person._father = json.parents[1];
      }
    }
    
    return person;
  }
}
