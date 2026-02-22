class FamilyCanvas {
  constructor(canvasElement, familyTree) {
    this._canvas = canvasElement;
    this._ctx = canvasElement.getContext('2d');
    this._familyTree = familyTree;
    this._offsetX = 0;
    this._offsetY = 0;
    this._scale = 1;
    this._isDragging = false;
    this._dragStartX = 0;
    this._dragStartY = 0;
    this._selectedPerson = null;
    this._isDraggingPerson = false;
    this._personWidth = 150;
    this._personHeight = 80;
    this._hasMoved = false;
    this._focusMode = false;
    this._focusPerson = null;
    this._visiblePersons = new Set();
    
    this._setupCanvas();
    this._setupEventListeners();
    logger.info('FamilyCanvas', 'Initialized');
  }

  /**
   * Sets up canvas size
   */
  _setupCanvas() {
    this._canvas.width = this._canvas.clientWidth;
    this._canvas.height = this._canvas.clientHeight;
  }

  /**
   * Sets up event listeners
   */
  _setupEventListeners() {
    this._canvas.addEventListener('mousedown', this._onMouseDown.bind(this));
    document.addEventListener('mousemove', this._onMouseMove.bind(this));
    document.addEventListener('mouseup', this._onMouseUp.bind(this));
    this._canvas.addEventListener('wheel', this._onWheel.bind(this));
    
    this._canvas.addEventListener('touchstart', this._onTouchStart.bind(this), { passive: false });
    this._canvas.addEventListener('touchmove', this._onTouchMove.bind(this), { passive: false });
    this._canvas.addEventListener('touchend', this._onTouchEnd.bind(this), { passive: false });
    
    window.addEventListener('resize', () => {
      this._setupCanvas();
      this.render();
    });
  }

  /**
   * Handles mouse down event
   * @param {MouseEvent} e - Mouse event
   */
  _onMouseDown(e) {
    if (e.button !== 0) return;
    
    console.log('Mouse down event triggered');
    
    const rect = this._canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - this._offsetX) / this._scale;
    const y = (e.clientY - rect.top - this._offsetY) / this._scale;

    console.log(`Click position: (${x}, ${y})`);

    const clickedPerson = this._getPersonAt(x, y);

    if (clickedPerson && this._ui && this._ui._focusModeActive) {
      e.preventDefault();
      console.log('Focus mode active, focusing on person:', clickedPerson.getId());
      this.focusOnPerson(clickedPerson);
      this._ui._deactivateFocusMode();
      return;
    }

    if (clickedPerson) {
      e.preventDefault();
      this._selectedPerson = clickedPerson;
      this._isDraggingPerson = true;
      this._hasMoved = false;
      this._dragStartX = x - clickedPerson.getX();
      this._dragStartY = y - clickedPerson.getY();
      console.log('Person selected for dragging:', clickedPerson.getId());
      logger.info('FamilyCanvas', 'Person selected for dragging', { id: clickedPerson.getId() });
    } else {
      this._isDragging = true;
      this._hasMoved = false;
      this._dragStartX = e.clientX - this._offsetX;
      this._dragStartY = e.clientY - this._offsetY;
      console.log('Canvas selected for panning');
    }
  }

  /**
   * Handles mouse move event
   * @param {MouseEvent} e - Mouse event
   */
  _onMouseMove(e) {
    if (this._isDraggingPerson && this._selectedPerson) {
      this._hasMoved = true;
      const rect = this._canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left - this._offsetX) / this._scale;
      const y = (e.clientY - rect.top - this._offsetY) / this._scale;

      this._selectedPerson.setX(x - this._dragStartX);
      this._selectedPerson.setY(y - this._dragStartY);
      this.render();
    } else if (this._isDragging) {
      this._hasMoved = true;
      this._offsetX = e.clientX - this._dragStartX;
      this._offsetY = e.clientY - this._dragStartY;
      this.render();
    }
  }

  /**
   * Handles mouse up event
   */
  _onMouseUp() {
    if (this._isDraggingPerson) {
      console.log('Person drag completed, saving...');
      this._familyTree.saveToLocalStorage();
    }
    if (this._isDragging || this._isDraggingPerson) {
      console.log('Drag operation completed');
    }
    this._isDragging = false;
    this._isDraggingPerson = false;
  }

  /**
   * Handles wheel event for zoom
   * @param {WheelEvent} e - Wheel event
   */
  _onWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    this._scale *= delta;
    this._scale = Math.max(0.1, Math.min(3, this._scale));
    this.render();
  }

  /**
   * Handles touch start event
   * @param {TouchEvent} e - Touch event
   */
  _onTouchStart(e) {
    if (e.touches.length === 1) {
      e.preventDefault();
      const touch = e.touches[0];
      const rect = this._canvas.getBoundingClientRect();
      const x = (touch.clientX - rect.left - this._offsetX) / this._scale;
      const y = (touch.clientY - rect.top - this._offsetY) / this._scale;

      const clickedPerson = this._getPersonAt(x, y);

      if (clickedPerson) {
        this._selectedPerson = clickedPerson;
        this._isDraggingPerson = true;
        this._hasMoved = false;
        this._dragStartX = x - clickedPerson.getX();
        this._dragStartY = y - clickedPerson.getY();
        this._touchStartTime = Date.now();
        logger.info('FamilyCanvas', 'Person selected via touch', { id: clickedPerson.getId() });
      } else {
        this._isDragging = true;
        this._hasMoved = false;
        this._dragStartX = touch.clientX - this._offsetX;
        this._dragStartY = touch.clientY - this._offsetY;
      }
    } else if (e.touches.length === 2) {
      this._isDragging = false;
      this._isDraggingPerson = false;
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      this._lastPinchDistance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );
    }
  }

  /**
   * Handles touch move event
   * @param {TouchEvent} e - Touch event
   */
  _onTouchMove(e) {
    if (e.touches.length === 1 && (this._isDraggingPerson || this._isDragging)) {
      e.preventDefault();
      const touch = e.touches[0];
      this._hasMoved = true;

      if (this._isDraggingPerson && this._selectedPerson) {
        const rect = this._canvas.getBoundingClientRect();
        const x = (touch.clientX - rect.left - this._offsetX) / this._scale;
        const y = (touch.clientY - rect.top - this._offsetY) / this._scale;

        this._selectedPerson.setX(x - this._dragStartX);
        this._selectedPerson.setY(y - this._dragStartY);
        this.render();
      } else if (this._isDragging) {
        this._offsetX = touch.clientX - this._dragStartX;
        this._offsetY = touch.clientY - this._dragStartY;
        this.render();
      }
    } else if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      );

      if (this._lastPinchDistance) {
        const delta = distance / this._lastPinchDistance;
        this._scale *= delta;
        this._scale = Math.max(0.1, Math.min(3, this._scale));
        this.render();
      }

      this._lastPinchDistance = distance;
    }
  }

  /**
   * Handles touch end event
   * @param {TouchEvent} e - Touch event
   */
  _onTouchEnd(e) {
    if (this._isDraggingPerson) {
      this._familyTree.saveToLocalStorage();
    }

    if (!this._hasMoved && this._selectedPerson && this._touchStartTime) {
      const touchDuration = Date.now() - this._touchStartTime;
      if (touchDuration < 300) {
        const rect = this._canvas.getBoundingClientRect();
        const touch = e.changedTouches[0];
        const event = new MouseEvent('contextmenu', {
          clientX: touch.clientX,
          clientY: touch.clientY,
          bubbles: true
        });
        this._canvas.dispatchEvent(event);
      }
    }

    this._isDragging = false;
    this._isDraggingPerson = false;
    this._lastPinchDistance = null;
    this._touchStartTime = null;
  }

  /**
   * Gets person at coordinates
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @returns {Person} Person at coordinates
   */
  _getPersonAt(x, y) {
    const persons = this._familyTree.getAllPersons();
    for (const person of persons) {
      const px = person.getX();
      const py = person.getY();
      if (x >= px && x <= px + this._personWidth &&
          y >= py && y <= py + this._personHeight) {
        return person;
      }
    }
    return null;
  }

  /**
   * Gets person at screen coordinates
   * @param {number} screenX - Screen X coordinate
   * @param {number} screenY - Screen Y coordinate
   * @returns {Person} Person at coordinates
   */
  getPersonAtScreen(screenX, screenY) {
    const rect = this._canvas.getBoundingClientRect();
    const x = (screenX - rect.left - this._offsetX) / this._scale;
    const y = (screenY - rect.top - this._offsetY) / this._scale;
    return this._getPersonAt(x, y);
  }

  /**
   * Renders the family tree
   */
  render() {
    const allPersons = this._familyTree.getAllPersons();
    const persons = this._focusMode ? 
      allPersons.filter(p => this._visiblePersons.has(p.getId())) : 
      allPersons;
    console.log(`Rendering ${persons.length} persons`);
    
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.save();
    this._ctx.translate(this._offsetX, this._offsetY);
    this._ctx.scale(this._scale, this._scale);

    this._drawConnections();
    this._drawPersons();

    this._ctx.restore();
  }

  /**
   * Draws connections between persons
   */
  _drawConnections() {
    const allPersons = this._familyTree.getAllPersons();
    const persons = this._focusMode ? 
      allPersons.filter(p => this._visiblePersons.has(p.getId())) : 
      allPersons;
    const drawnSpouses = new Set();
    
    persons.forEach(person => {
      person.getSpouses().forEach(spouseId => {
        const spouse = this._familyTree.getPerson(spouseId);
        if (spouse && !drawnSpouses.has(`${spouseId}-${person.getId()}`)) {
          const x1 = person.getX() + this._personWidth / 2;
          const y1 = person.getY() + this._personHeight / 2;
          const x2 = spouse.getX() + this._personWidth / 2;
          const y2 = spouse.getY() + this._personHeight / 2;
          
          if (Math.abs(y1 - y2) < 10) {
            this._drawLine(x1, y1, x2, y2, '#ff6b6b', 3);
          } else {
            const midX = (x1 + x2) / 2;
            this._drawLine(x1, y1, midX, y1, '#ff6b6b', 3);
            this._drawLine(midX, y1, midX, y2, '#ff6b6b', 3);
            this._drawLine(midX, y2, x2, y2, '#ff6b6b', 3);
          }
          
          drawnSpouses.add(`${person.getId()}-${spouseId}`);
        }
      });
    });
    
    const parentPairs = new Map();
    
    persons.forEach(child => {
      const mother = child.getMother() ? this._familyTree.getPerson(child.getMother()) : null;
      const father = child.getFather() ? this._familyTree.getPerson(child.getFather()) : null;
      
      if (mother && father) {
        const pairKey = [mother.getId(), father.getId()].sort().join('-');
        if (!parentPairs.has(pairKey)) {
          parentPairs.set(pairKey, {
            mother,
            father,
            children: []
          });
        }
        parentPairs.get(pairKey).children.push(child);
      } else if (mother) {
        const motherX = mother.getX() + this._personWidth / 2;
        const motherY = mother.getY() + this._personHeight / 2;
        const childX = child.getX() + this._personWidth / 2;
        const childY = child.getY() + this._personHeight / 2;
        
        const midY = motherY + (childY - motherY) / 2;
        this._drawLine(motherX, motherY, motherX, midY, '#667eea', 2);
        this._drawLine(motherX, midY, childX, midY, '#667eea', 2);
        this._drawLine(childX, midY, childX, childY, '#667eea', 2);
      } else if (father) {
        const fatherX = father.getX() + this._personWidth / 2;
        const fatherY = father.getY() + this._personHeight / 2;
        const childX = child.getX() + this._personWidth / 2;
        const childY = child.getY() + this._personHeight / 2;
        
        const midY = fatherY + (childY - fatherY) / 2;
        this._drawLine(fatherX, fatherY, fatherX, midY, '#667eea', 2);
        this._drawLine(fatherX, midY, childX, midY, '#667eea', 2);
        this._drawLine(childX, midY, childX, childY, '#667eea', 2);
      }
    });
    
    parentPairs.forEach(({ mother, father, children }) => {
      const motherX = mother.getX() + this._personWidth / 2;
      const motherY = mother.getY() + this._personHeight / 2;
      const fatherX = father.getX() + this._personWidth / 2;
      const fatherY = father.getY() + this._personHeight / 2;
      
      const parentMidX = (motherX + fatherX) / 2;
      const parentMidY = (motherY + fatherY) / 2;
      
      const verticalDropY = parentMidY + 60;
      this._drawLine(parentMidX, parentMidY, parentMidX, verticalDropY, '#667eea', 2);
      
      if (children.length > 0) {
        const childrenX = children.map(c => c.getX() + this._personWidth / 2);
        const minChildX = Math.min(...childrenX);
        const maxChildX = Math.max(...childrenX);
        
        this._drawLine(minChildX, verticalDropY, maxChildX, verticalDropY, '#667eea', 2);
        
        children.forEach(child => {
          const childX = child.getX() + this._personWidth / 2;
          const childY = child.getY() + this._personHeight / 2;
          this._drawLine(childX, verticalDropY, childX, childY, '#667eea', 2);
        });
      }
    });
  }

  /**
   * Draws line between points
   * @param {number} x1 - Start X
   * @param {number} y1 - Start Y
   * @param {number} x2 - End X
   * @param {number} y2 - End Y
   * @param {string} color - Line color
   * @param {number} width - Line width
   */
  _drawLine(x1, y1, x2, y2, color, width) {
    this._ctx.beginPath();
    this._ctx.moveTo(x1, y1);
    this._ctx.lineTo(x2, y2);
    this._ctx.strokeStyle = color;
    this._ctx.lineWidth = width;
    this._ctx.stroke();
  }

  /**
   * Draws all persons
   */
  _drawPersons() {
    const allPersons = this._familyTree.getAllPersons();
    const persons = this._focusMode ? 
      allPersons.filter(p => this._visiblePersons.has(p.getId())) : 
      allPersons;
    persons.forEach(person => this._drawPerson(person));
  }

  /**
   * Draws a person node
   * @param {Person} person - Person to draw
   */
  _drawPerson(person) {
    const x = person.getX();
    const y = person.getY();

    this._ctx.font = 'bold 14px Arial';
    const nameWidth = this._ctx.measureText(person.getFullName()).width;
    
    this._ctx.font = '11px Arial';
    let dateText = '';
    if (person.getBirthday()) {
      dateText = person.getBirthday();
      if (person.getDeathday()) {
        dateText += ' - ' + person.getDeathday();
      }
    }
    const dateWidth = dateText ? this._ctx.measureText(dateText).width : 0;
    
    const textWidth = Math.max(nameWidth, dateWidth);
    const dynamicWidth = Math.max(this._personWidth, textWidth + 90);
    
    this._ctx.fillStyle = 'white';
    this._ctx.strokeStyle = person.getGender() === 'female' ? '#ff69b4' : '#4a90e2';
    this._ctx.lineWidth = 3;
    this._drawRoundRect(x, y, dynamicWidth, this._personHeight, 10);
    this._ctx.fill();
    this._ctx.stroke();

    if (person.getPhoto()) {
      const img = new Image();
      img.src = person.getPhoto();
      this._ctx.save();
      this._ctx.beginPath();
      this._ctx.arc(x + 30, y + 40, 25, 0, Math.PI * 2);
      this._ctx.clip();
      this._ctx.drawImage(img, x + 5, y + 15, 50, 50);
      this._ctx.restore();
    } else {
      this._ctx.fillStyle = '#667eea';
      this._ctx.beginPath();
      this._ctx.arc(x + 30, y + 40, 25, 0, Math.PI * 2);
      this._ctx.fill();
      
      this._ctx.fillStyle = 'white';
      this._ctx.font = 'bold 20px Arial';
      this._ctx.textAlign = 'center';
      this._ctx.textBaseline = 'middle';
      const initials = person.getFirstName()[0] + person.getLastName()[0];
      this._ctx.fillText(initials, x + 30, y + 40);
    }

    this._ctx.fillStyle = '#333';
    this._ctx.font = 'bold 14px Arial';
    this._ctx.textAlign = 'left';
    this._ctx.fillText(person.getFullName(), x + 65, y + 30);

    if (dateText) {
      this._ctx.font = '11px Arial';
      this._ctx.fillStyle = '#666';
      this._ctx.fillText(dateText, x + 65, y + 50);
    }
  }

  /**
   * Centers view on all persons
   */
  centerView() {
    const persons = this._familyTree.getAllPersons();
    if (persons.length === 0) return;

    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    persons.forEach(person => {
      minX = Math.min(minX, person.getX());
      minY = Math.min(minY, person.getY());
      maxX = Math.max(maxX, person.getX() + this._personWidth);
      maxY = Math.max(maxY, person.getY() + this._personHeight);
    });

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    this._offsetX = this._canvas.width / 2 - centerX * this._scale;
    this._offsetY = this._canvas.height / 2 - centerY * this._scale;

    this.render();
  }

  /**
   * Focuses on a person and their direct relatives
   * @param {Person} person - Person to focus on
   */
  focusOnPerson(person) {
    if (!person) return;
    
    logger.info('FamilyCanvas', 'Focus on person', { id: person.getId(), name: person.getFullName() });
    
    this._focusMode = true;
    this._focusPerson = person;
    this._visiblePersons.clear();
    
    this._visiblePersons.add(person.getId());
    
    const addAncestors = (personId) => {
      const p = this._familyTree.getPerson(personId);
      if (!p) return;
      
      const motherId = p.getMother();
      if (motherId) {
        this._visiblePersons.add(motherId);
        addAncestors(motherId);
      }
      
      const fatherId = p.getFather();
      if (fatherId) {
        this._visiblePersons.add(fatherId);
        addAncestors(fatherId);
      }
    };
    
    addAncestors(person.getId());
    
    person.getSpouses().forEach(spouseId => {
      this._visiblePersons.add(spouseId);
    });
    
    person.getChildren().forEach(childId => {
      this._visiblePersons.add(childId);
    });
    
    const motherId = person.getMother();
    const fatherId = person.getFather();
    if (motherId && fatherId) {
      const mother = this._familyTree.getPerson(motherId);
      if (mother) {
        mother.getChildren().forEach(childId => {
          this._visiblePersons.add(childId);
        });
      }
    }
    
    this.render();
    this.centerView();
  }

  /**
   * Exits focus mode and shows all persons
   */
  unfocus() {
    logger.info('FamilyCanvas', 'Unfocus - showing all persons');
    this._focusMode = false;
    this._focusPerson = null;
    this._visiblePersons.clear();
    this.render();
  }

  /**
   * Auto layout to ensure 90-degree lines
   */
  autoLayout() {
    const persons = this._familyTree.getAllPersons();
    if (persons.length === 0) return;
    
    logger.info('FamilyCanvas', 'Auto layout started');
    
    persons.forEach(person => {
      person.getSpouses().forEach(spouseId => {
        const spouse = this._familyTree.getPerson(spouseId);
        if (spouse && person.getId() < spouseId) {
          spouse.setY(person.getY());
        }
      });
    });
    
    this.render();
    logger.info('FamilyCanvas', 'Auto layout completed');
  }

  /**
   * Draws rounded rectangle
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {number} radius - Corner radius
   */
  _drawRoundRect(x, y, width, height, radius) {
    this._ctx.beginPath();
    this._ctx.moveTo(x + radius, y);
    this._ctx.lineTo(x + width - radius, y);
    this._ctx.arcTo(x + width, y, x + width, y + radius, radius);
    this._ctx.lineTo(x + width, y + height - radius);
    this._ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    this._ctx.lineTo(x + radius, y + height);
    this._ctx.arcTo(x, y + height, x, y + height - radius, radius);
    this._ctx.lineTo(x, y + radius);
    this._ctx.arcTo(x, y, x + radius, y, radius);
    this._ctx.closePath();
  }

  /**
   * Sets UI reference
   * @param {UI} ui - UI instance
   */
  setUI(ui) {
    this._ui = ui;
  }
}

