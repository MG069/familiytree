class FamilyTree {
  constructor() {
    this._persons = new Map();
    this._nextId = 1;
    logger.info('FamilyTree', 'Initialized');
  }

  /**
   * Creates new person
   * @param {string} firstName - First name
   * @param {string} lastName - Last name
   * @param {string} gender - Gender (male/female)
   * @returns {Person} Created person
   */
  createPerson(firstName, lastName, gender = 'male') {
    const id = `person_${this._nextId++}`;
    const person = new Person(id, firstName, lastName, gender);
    this._persons.set(id, person);
    logger.info('FamilyTree', 'Person created', { id, firstName, lastName, gender });
    return person;
  }

  /**
   * Gets person by ID
   * @param {string} id - Person ID
   * @returns {Person} Person instance
   */
  getPerson(id) {
    return this._persons.get(id);
  }

  /**
   * Gets all persons
   * @returns {Array} Array of persons
   */
  getAllPersons() {
    return Array.from(this._persons.values());
  }

  /**
   * Deletes person
   * @param {string} id - Person ID
   */
  deletePerson(id) {
    const person = this._persons.get(id);
    if (!person) {
      logger.warn('FamilyTree', 'Person not found for deletion', { id });
      return;
    }

    person.getParents().forEach(parentId => {
      const parent = this._persons.get(parentId);
      if (parent) {
        parent.removeChild(id);
      }
    });

    person.getChildren().forEach(childId => {
      const child = this._persons.get(childId);
      if (child) {
        child.removeParent(id);
      }
    });

    person.getSpouses().forEach(spouseId => {
      const spouse = this._persons.get(spouseId);
      if (spouse) {
        spouse.removeSpouse(id);
      }
    });

    this._persons.delete(id);
    logger.info('FamilyTree', 'Person deleted', { id });
  }

  /**
   * Adds parent-child relationship
   * @param {string} parentId - Parent ID
   * @param {string} childId - Child ID
   */
  addParentChildRelationship(parentId, childId) {
    const parent = this._persons.get(parentId);
    const child = this._persons.get(childId);

    if (!parent || !child) {
      logger.error('FamilyTree', 'Invalid parent-child relationship', { parentId, childId });
      return;
    }

    parent.addChild(childId);
    child.addParent(parentId);
    logger.info('FamilyTree', 'Parent-child relationship added', { parentId, childId });
  }

  /**
   * Adds spouse relationship
   * @param {string} spouse1Id - First spouse ID
   * @param {string} spouse2Id - Second spouse ID
   */
  addSpouseRelationship(spouse1Id, spouse2Id) {
    const spouse1 = this._persons.get(spouse1Id);
    const spouse2 = this._persons.get(spouse2Id);

    if (!spouse1 || !spouse2) {
      logger.error('FamilyTree', 'Invalid spouse relationship', { spouse1Id, spouse2Id });
      return;
    }

    spouse1.addSpouse(spouse2Id);
    spouse2.addSpouse(spouse1Id);
    logger.info('FamilyTree', 'Spouse relationship added', { spouse1Id, spouse2Id });
  }

  /**
   * Removes spouse relationship
   * @param {string} spouse1Id - First spouse ID
   * @param {string} spouse2Id - Second spouse ID
   */
  removeSpouseRelationship(spouse1Id, spouse2Id) {
    const spouse1 = this._persons.get(spouse1Id);
    const spouse2 = this._persons.get(spouse2Id);

    if (spouse1) {
      spouse1.removeSpouse(spouse2Id);
    }
    if (spouse2) {
      spouse2.removeSpouse(spouse1Id);
    }
    logger.info('FamilyTree', 'Spouse relationship removed', { spouse1Id, spouse2Id });
  }

  /**
   * Exports family tree to JSON
   * @returns {string} JSON string
   */
  exportToJSON() {
    const data = {
      nextId: this._nextId,
      persons: this.getAllPersons().map(p => p.toJSON())
    };
    logger.info('FamilyTree', 'Exported to JSON', { personCount: this._persons.size });
    return JSON.stringify(data, null, 2);
  }

  /**
   * Imports family tree from JSON
   * @param {string} jsonString - JSON string
   */
  importFromJSON(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      this._persons.clear();
      this._nextId = data.nextId || 1;

      data.persons.forEach(personData => {
        const person = Person.fromJSON(personData);
        this._persons.set(person.getId(), person);
      });

      logger.info('FamilyTree', 'Imported from JSON', { personCount: this._persons.size });
    } catch (error) {
      logger.error('FamilyTree', 'Failed to import from JSON', error);
      throw error;
    }
  }

  /**
   * Clears all data
   */
  clear() {
    this._persons.clear();
    this._nextId = 1;
    logger.info('FamilyTree', 'Cleared all data');
  }

  /**
   * Saves to localStorage
   */
  saveToLocalStorage() {
    try {
      localStorage.setItem('familyTreeData', this.exportToJSON());
      logger.info('FamilyTree', 'Saved to localStorage');
    } catch (error) {
      logger.error('FamilyTree', 'Failed to save to localStorage', error);
    }
  }

  /**
   * Loads from localStorage
   */
  loadFromLocalStorage() {
    try {
      const data = localStorage.getItem('familyTreeData');
      if (data) {
        this.importFromJSON(data);
        logger.info('FamilyTree', 'Loaded from localStorage');
        return true;
      }
    } catch (error) {
      logger.error('FamilyTree', 'Failed to load from localStorage', error);
    }
    return false;
  }
}
