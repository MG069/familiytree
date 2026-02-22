class UI {
  constructor(familyTree, canvas) {
    this._familyTree = familyTree;
    this._canvas = canvas;
    this._currentEditingPerson = null;
    this._currentViewingPerson = null;
    this._relationshipMode = null;
    this._relationshipSourcePerson = null;
    this._mediaFiles = null;
    this._currentMediaIndex = 0;
    this._focusModeActive = false;
    
    this._setupEventListeners();
    logger.info('UI', 'Initialized');
  }

  /**
   * Sets up event listeners
   */
  _setupEventListeners() {
    document.getElementById('languageSelector').addEventListener('change', (e) => {
      i18n.setLanguage(e.target.value);
      logger.info('UI', 'Language changed', { language: e.target.value });
    });

    document.getElementById('addPersonBtn').addEventListener('click', () => {
      this._openPersonModal();
    });

    document.getElementById('exportBtn').addEventListener('click', () => {
      this._exportJSON();
    });

    document.getElementById('importBtn').addEventListener('click', () => {
      document.getElementById('importFile').click();
    });

    document.getElementById('importFile').addEventListener('change', (e) => {
      this._importJSON(e.target.files[0]);
    });

    document.querySelector('#personModal .close').addEventListener('click', () => {
      this._closePersonModal();
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
      this._closePersonModal();
    });

    document.getElementById('personForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this._savePerson();
    });

    document.getElementById('photo').addEventListener('change', (e) => {
      this._handlePhotoUpload(e.target.files[0]);
    });

    document.getElementById('files').addEventListener('change', (e) => {
      this._handleFilesUpload(e.target.files);
    });

    this._canvas._canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      console.log('Right-click detected on canvas');
      this._showContextMenu(e);
    });

    document.getElementById('addChild').addEventListener('click', () => {
      console.log('Add child clicked');
      this._addChildDirectly();
    });

    document.getElementById('addParents').addEventListener('click', () => {
      this._addParentsDirectly();
    });

    document.getElementById('addSpouse').addEventListener('click', () => {
      this._addSpouseDirectly();
    });

    document.getElementById('addBrother').addEventListener('click', () => {
      this._addBrotherDirectly();
    });

    document.getElementById('addSister').addEventListener('click', () => {
      this._addSisterDirectly();
    });

    document.getElementById('autoLayoutBtn').addEventListener('click', () => {
      this._canvas.autoLayout();
    });

    document.getElementById('focusBtn').addEventListener('click', () => {
      this._activateFocusMode();
    });

    document.getElementById('showAllBtn').addEventListener('click', () => {
      this._canvas.unfocus();
      this._deactivateFocusMode();
    });

    document.getElementById('editPerson').addEventListener('click', () => {
      this._editSelectedPerson();
    });

    document.getElementById('viewInfo').addEventListener('click', () => {
      this._viewPersonInfo();
    });

    document.getElementById('viewFiles').addEventListener('click', () => {
      this._viewFiles();
    });

    document.getElementById('deletePerson').addEventListener('click', () => {
      this._deleteSelectedPerson();
    });

    document.querySelector('#filesModal .close').addEventListener('click', () => {
      this._closeFilesModal();
    });

    document.getElementById('closeFilesBtn').addEventListener('click', () => {
      this._closeFilesModal();
    });

    document.querySelector('#infoModal .close').addEventListener('click', () => {
      this._closeInfoModal();
    });

    document.getElementById('closeInfoBtn').addEventListener('click', () => {
      this._closeInfoModal();
    });

    document.getElementById('editFromInfoBtn').addEventListener('click', () => {
      this._editFromInfo();
    });

    document.getElementById('backupsBtn').addEventListener('click', () => {
      this._openBackupsModal();
    });

    document.querySelector('#backupsModal .close').addEventListener('click', () => {
      this._closeBackupsModal();
    });

    document.getElementById('closeBackupsBtn').addEventListener('click', () => {
      this._closeBackupsModal();
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.context-menu')) {
        this._hideContextMenu();
      }
    });

    this._canvas._canvas.addEventListener('click', (e) => {
      if (this._relationshipMode) {
        this._handleRelationshipClick(e);
      }
    });

    this._canvas._canvas.addEventListener('dblclick', (e) => {
      console.log('=== DOUBLE CLICK EVENT FIRED ===');
      this._handleDoubleClick(e);
    });

    document.querySelector('#mediaViewerModal .close').addEventListener('click', () => {
      this._closeMediaViewer();
    });

    document.getElementById('mediaPrevBtn').addEventListener('click', () => {
      this._showPreviousMedia();
    });

    document.getElementById('mediaNextBtn').addEventListener('click', () => {
      this._showNextMedia();
    });

    document.getElementById('mediaDownloadBtn').addEventListener('click', () => {
      this._downloadCurrentMedia();
    });
    
    console.log('UI: All event listeners attached including double-click');
    logger.info('UI', 'Event listeners attached');
  }

  /**
   * Opens person modal
   * @param {Person} person - Person to edit
   */
  _openPersonModal(person = null) {
    console.log('=== _openPersonModal called ===');
    console.log('Person:', person);
    
    this._currentEditingPerson = person;
    const modal = document.getElementById('personModal');

    document.getElementById('personForm').reset();
    document.getElementById('photoPreview').innerHTML = '';
    document.getElementById('filesPreview').innerHTML = '';

    if (person) {
      console.log('Filling form with person data:');
      console.log('First Name:', person.getFirstName());
      console.log('Last Name:', person.getLastName());
      console.log('Gender:', person.getGender());
      console.log('Birthday:', person.getBirthday());
      console.log('Info:', person.getInfo());
      
      document.getElementById('firstName').value = person.getFirstName() || '';
      document.getElementById('lastName').value = person.getLastName() || '';
      document.getElementById('gender').value = person.getGender() || 'male';
      document.getElementById('birthday').value = person.getBirthday() || '';
      document.getElementById('deathday').value = person.getDeathday() || '';
      document.getElementById('info').value = person.getInfo() || '';
      document.getElementById('dataLink').value = person.getDataLink() || '';

      console.log('Form fields after setting:');
      console.log('firstName field value:', document.getElementById('firstName').value);
      console.log('lastName field value:', document.getElementById('lastName').value);

      if (person.getPhoto()) {
        document.getElementById('photoPreview').innerHTML = 
          `<div style="position: relative; display: inline-block;">
            <img src="${person.getPhoto()}" alt="Photo">
            <button type="button" class="delete-photo-btn" onclick="ui._deletePhoto()" style="position: absolute; top: 5px; right: 5px; background: #ff4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 1.2rem; line-height: 1;">&times;</button>
          </div>`;
      }

      const files = person.getFiles();
      if (files && files.length > 0) {
        this._displayFiles(files);
      }
    }

    modal.style.display = 'block';
  }

  /**
   * Closes person modal
   */
  _closePersonModal() {
    document.getElementById('personModal').style.display = 'none';
    this._currentEditingPerson = null;
  }

  /**
   * Saves person
   */
  _savePerson() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const gender = document.getElementById('gender').value;
    const birthday = document.getElementById('birthday').value;
    const deathday = document.getElementById('deathday').value;
    const info = document.getElementById('info').value;
    const dataLink = document.getElementById('dataLink').value;

    let person = this._currentEditingPerson;

    if (!person) {
      person = this._familyTree.createPerson(firstName, lastName, gender);
      person.setX(100 + Math.random() * 300);
      person.setY(100 + Math.random() * 300);
    } else {
      person.setFirstName(firstName);
      person.setLastName(lastName);
      person.setGender(gender);
    }

    person.setBirthday(birthday);
    person.setDeathday(deathday);
    person.setInfo(info);
    person.setDataLink(dataLink);

    this._familyTree.saveToLocalStorage();
    this._canvas.render();
    this._closePersonModal();
    logger.info('UI', 'Person saved', { id: person.getId() });
  }

  /**
   * Handles photo upload
   * @param {File} file - Photo file
   */
  async _handlePhotoUpload(file) {
    if (!file) return;

    const maxSize = 1 * 1024 * 1024;
    
    if (file.size > maxSize) {
      console.log(`Photo size: ${(file.size / 1024 / 1024).toFixed(2)}MB, compressing...`);
      
      if (file.type.startsWith('image/')) {
        alert(`Image is ${(file.size / 1024 / 1024).toFixed(2)}MB. Compressing to 1MB...`);
        const compressed = await this._compressImage(file, maxSize);
        this._setPhotoPreview(compressed);
      } else {
        alert('File is too large (max 1MB). Please upload an image or provide a Google Drive link in the "Data Link" field.');
        document.getElementById('photo').value = '';
      }
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      this._setPhotoPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  /**
   * Sets photo preview
   * @param {string} dataURL - Photo data URL
   */
  _setPhotoPreview(dataURL) {
    document.getElementById('photoPreview').innerHTML = 
      `<div style="position: relative; display: inline-block;">
        <img src="${dataURL}" alt="Photo">
        <button type="button" class="delete-photo-btn" onclick="ui._deletePhoto()" style="position: absolute; top: 5px; right: 5px; background: #ff4444; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 1.2rem; line-height: 1;">&times;</button>
      </div>`;
    
    if (this._currentEditingPerson) {
      this._currentEditingPerson.setPhoto(dataURL);
    }
  }

  /**
   * Deletes photo from current person
   */
  _deletePhoto() {
    if (this._currentEditingPerson) {
      this._currentEditingPerson.setPhoto(null);
    }
    document.getElementById('photoPreview').innerHTML = '';
    document.getElementById('photo').value = '';
    logger.info('UI', 'Photo deleted');
  }

  /**
   * Handles files upload
   * @param {FileList} files - Files to upload
   */
  async _handleFilesUpload(files) {
    const maxSize = 1 * 1024 * 1024;
    
    for (const file of Array.from(files)) {
      if (file.size > maxSize) {
        console.log(`File ${file.name} size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
        
        if (file.type.startsWith('image/')) {
          alert(`Image "${file.name}" is ${(file.size / 1024 / 1024).toFixed(2)}MB. Compressing to 1MB...`);
          const compressed = await this._compressImage(file, maxSize);
          await this._addFileToPreview(file.name, file.type, compressed);
        } else {
          alert(`File "${file.name}" is too large (${(file.size / 1024 / 1024).toFixed(2)}MB, max 1MB).\n\nPlease:\n- Upload a smaller file\n- Provide a Google Drive link in "Data Link" field\n- Paste URL in "Information" field`);
        }
        continue;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = {
          name: file.name,
          type: file.type,
          data: e.target.result
        };

        if (this._currentEditingPerson) {
          this._currentEditingPerson.addFile(fileData);
          this._displayFiles(this._currentEditingPerson.getFiles());
        }
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Adds file to preview after compression
   * @param {string} name - File name
   * @param {string} type - File type
   * @param {string} dataURL - File data URL
   */
  async _addFileToPreview(name, type, dataURL) {
    const fileData = {
      name: name,
      type: type,
      data: dataURL
    };

    if (this._currentEditingPerson) {
      this._currentEditingPerson.addFile(fileData);
      this._displayFiles(this._currentEditingPerson.getFiles());
    }
  }

  /**
   * Compresses image to target size
   * @param {File} file - Image file
   * @param {number} maxSize - Maximum size in bytes
   * @returns {Promise<string>} Compressed image data URL
   */
  async _compressImage(file, maxSize) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const scale = Math.sqrt(maxSize / (file.size * 0.7));
          width = Math.floor(width * scale);
          height = Math.floor(height * scale);
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          let quality = 0.7;
          let compressed = canvas.toDataURL('image/jpeg', quality);
          
          while (compressed.length > maxSize * 1.37 && quality > 0.1) {
            quality -= 0.1;
            compressed = canvas.toDataURL('image/jpeg', quality);
          }
          
          console.log(`Compressed to ${(compressed.length / 1024 / 1024).toFixed(2)}MB`);
          logger.info('UI', 'Image compressed', { 
            originalSize: (file.size / 1024 / 1024).toFixed(2) + 'MB',
            compressedSize: (compressed.length / 1024 / 1024).toFixed(2) + 'MB'
          });
          
          resolve(compressed);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * Displays files
   * @param {Array} files - Files to display
   */
  _displayFiles(files) {
    const preview = document.getElementById('filesPreview');
    preview.innerHTML = '';
    files.forEach((file, index) => {
      const div = document.createElement('div');
      div.className = 'file-item';
      div.style.cssText = 'display: flex; align-items: center; gap: 0.5rem; justify-content: space-between;';
      
      const nameSpan = document.createElement('span');
      nameSpan.textContent = file.name;
      
      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.style.cssText = 'background: #ff4444; color: white; border: none; border-radius: 50%; width: 25px; height: 25px; cursor: pointer; font-size: 1.2rem; line-height: 1;';
      deleteBtn.onclick = () => this._deleteFile(index);
      
      div.appendChild(nameSpan);
      div.appendChild(deleteBtn);
      preview.appendChild(div);
    });
  }

  /**
   * Deletes file from current person
   * @param {number} index - File index
   */
  _deleteFile(index) {
    if (this._currentEditingPerson) {
      this._currentEditingPerson.removeFile(index);
      this._displayFiles(this._currentEditingPerson.getFiles());
      logger.info('UI', 'File deleted', { index });
    }
  }

  /**
   * Shows context menu
   * @param {MouseEvent} e - Mouse event
   */
  _showContextMenu(e) {
    console.log('Context menu triggered at:', e.clientX, e.clientY);
    const person = this._canvas.getPersonAtScreen(e.clientX, e.clientY);
    console.log('Person found:', person ? person.getId() : 'none');
    
    if (!person) {
      this._hideContextMenu();
      console.log('No person at click position, hiding menu');
      return;
    }

    if (this._focusModeActive) {
      this._canvas.focusOnPerson(person);
      this._deactivateFocusMode();
      return;
    }

    this._canvas._selectedPerson = person;
    const menu = document.getElementById('contextMenu');
    menu.style.display = 'block';
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';
    console.log('Context menu shown for:', person.getFullName());
    logger.info('UI', 'Context menu shown', { personId: person.getId() });
  }

  /**
   * Hides context menu
   */
  _hideContextMenu() {
    document.getElementById('contextMenu').style.display = 'none';
  }

  /**
   * Starts relationship mode
   * @param {string} mode - Relationship mode
   */
  _startRelationshipMode(mode) {
    if (!this._canvas._selectedPerson) {
      console.error('No person selected for relationship');
      alert(i18n.t('pleaseSelectPerson'));
      return;
    }
    
    this._relationshipMode = mode;
    this._relationshipSourcePerson = this._canvas._selectedPerson;
    this._hideContextMenu();
    
    const message = i18n.t(mode === 'child' ? 'selectChild' : 
                          mode === 'parent' ? 'selectParent' : 'selectSpouse');
    console.log('Relationship mode started:', mode, 'from:', this._relationshipSourcePerson.getId());
    alert(message);
    logger.info('UI', 'Relationship mode started', { mode, source: this._relationshipSourcePerson.getId() });
  }

  /**
   * Handles relationship click
   * @param {MouseEvent} e - Mouse event
   */
  _handleRelationshipClick(e) {
    const targetPerson = this._canvas.getPersonAtScreen(e.clientX, e.clientY);
    
    if (!targetPerson || targetPerson === this._relationshipSourcePerson) {
      return;
    }

    if (this._relationshipMode === 'child') {
      this._familyTree.addParentChildRelationship(
        this._relationshipSourcePerson.getId(),
        targetPerson.getId()
      );
    } else if (this._relationshipMode === 'parent') {
      this._familyTree.addParentChildRelationship(
        targetPerson.getId(),
        this._relationshipSourcePerson.getId()
      );
    } else if (this._relationshipMode === 'spouse') {
      this._familyTree.addSpouseRelationship(
        this._relationshipSourcePerson.getId(),
        targetPerson.getId()
      );
    }

    this._relationshipMode = null;
    this._relationshipSourcePerson = null;
    this._familyTree.saveToLocalStorage();
    this._canvas.render();
  }

  /**
   * Edits selected person
   */
  _editSelectedPerson() {
    console.log('=== EDIT CLICKED ===');
    console.log('Selected person:', this._canvas._selectedPerson);
    if (this._canvas._selectedPerson) {
      console.log('Opening edit modal for:', this._canvas._selectedPerson.getFullName());
      this._openPersonModal(this._canvas._selectedPerson);
      this._hideContextMenu();
      logger.info('UI', 'Edit person modal opened', { personId: this._canvas._selectedPerson.getId() });
    } else {
      console.error('No person selected to edit!');
    }
  }

  /**
   * Views person information
   */
  _viewPersonInfo() {
    if (this._canvas._selectedPerson) {
      this._openInfoModal(this._canvas._selectedPerson);
      this._hideContextMenu();
    }
  }

  /**
   * Handles double-click on canvas
   * @param {MouseEvent} e - Mouse event
   */
  _handleDoubleClick(e) {
    console.log('=== Double-click handler called ===');
    console.log('Event:', e);
    const person = this._canvas.getPersonAtScreen(e.clientX, e.clientY);
    console.log('Person found:', person);
    
    if (person) {
      console.log('Opening info modal for:', person.getFullName());
      this._openInfoModal(person);
      logger.info('UI', 'Person info opened via double-click', { personId: person.getId() });
    } else {
      console.log('No person at double-click position');
    }
  }

  /**
   * Opens info modal
   * @param {Person} person - Person to view
   */
  _openInfoModal(person) {
    console.log('=== _openInfoModal called ===');
    console.log('Person:', person);
    
    const modal = document.getElementById('infoModal');
    console.log('Info modal element:', modal);
    
    if (!modal) {
      console.error('Info modal element not found!');
      return;
    }
    
    document.getElementById('infoName').textContent = person.getFullName();
    console.log('Set name:', person.getFullName());
    
    if (person.getPhoto()) {
      const photoContainer = document.querySelector('.info-photo-container');
      photoContainer.style.display = 'block';
      document.getElementById('infoPhoto').src = person.getPhoto();
    } else {
      document.querySelector('.info-photo-container').style.display = 'none';
    }
    
    const birthday = person.getBirthday();
    const deathday = person.getDeathday();
    document.getElementById('infoBirthday').textContent = birthday ? new Date(birthday).toLocaleDateString() : i18n.t('notSpecified');
    document.getElementById('infoDeathday').textContent = deathday ? new Date(deathday).toLocaleDateString() : i18n.t('notSpecified');
    
    document.getElementById('infoText').textContent = person.getInfo() || '';
    
    this._displayRelationships(person);
    this._displayAttachments(person);
    
    this._currentViewingPerson = person;
    modal.style.display = 'block';
    
    console.log('Info modal opened for:', person.getFullName());
    logger.info('UI', 'Info modal opened', { personId: person.getId() });
  }

  /**
   * Displays relationships in info modal
   * @param {Person} person - Person to display relationships for
   */
  _displayRelationships(person) {
    const container = document.getElementById('infoRelationships');
    container.innerHTML = '';
    
    let hasRelationships = false;
    
    person.getParents().forEach(parentId => {
      const parent = this._familyTree.getPerson(parentId);
      if (parent) {
        hasRelationships = true;
        const div = document.createElement('div');
        div.className = 'relationship-item';
        div.innerHTML = `<span class="relationship-type">${i18n.t('parent')}</span><span class="relationship-name">${parent.getFullName()}</span>`;
        container.appendChild(div);
      }
    });
    
    person.getSpouses().forEach(spouseId => {
      const spouse = this._familyTree.getPerson(spouseId);
      if (spouse) {
        hasRelationships = true;
        const div = document.createElement('div');
        div.className = 'relationship-item';
        div.innerHTML = `<span class="relationship-type">${i18n.t('spouse')}</span><span class="relationship-name">${spouse.getFullName()}</span>`;
        container.appendChild(div);
      }
    });
    
    person.getChildren().forEach(childId => {
      const child = this._familyTree.getPerson(childId);
      if (child) {
        hasRelationships = true;
        const div = document.createElement('div');
        div.className = 'relationship-item';
        div.innerHTML = `<span class="relationship-type">${i18n.t('child')}</span><span class="relationship-name">${child.getFullName()}</span>`;
        container.appendChild(div);
      }
    });
    
    if (!hasRelationships) {
      container.innerHTML = `<p style="color: #999; font-style: italic;">${i18n.t('noRelationships')}</p>`;
    }
  }

  /**
   * Displays attachments in info modal
   * @param {Person} person - Person to display attachments for
   */
  _displayAttachments(person) {
    const container = document.getElementById('infoAttachments');
    container.innerHTML = '';
    
    const files = person.getFiles();
    
    if (files.length === 0) {
      container.innerHTML = `<p style="color: #999; font-style: italic;">${i18n.t('noAttachments')}</p>`;
      return;
    }
    
    files.forEach((file, index) => {
      const div = document.createElement('div');
      div.className = 'attachment-item';
      
      if (file.type && file.type.startsWith('image/')) {
        div.innerHTML = `
          <img src="${file.data}" alt="${file.name}">
          <div class="attachment-name">${file.name}</div>
        `;
        div.onclick = () => {
          this._openMediaViewer(files, index);
        };
      } else {
        div.innerHTML = `
          <div style="font-size: 3rem; color: #667eea;">📄</div>
          <div class="attachment-name">${file.name}</div>
        `;
        div.onclick = () => {
          this._openMediaViewer(files, index);
        };
      }
      
      container.appendChild(div);
    });
  }

  /**
   * Closes info modal
   */
  _closeInfoModal() {
    document.getElementById('infoModal').style.display = 'none';
    this._currentViewingPerson = null;
  }

  /**
   * Edits person from info modal
   */
  _editFromInfo() {
    if (this._currentViewingPerson) {
      const personToEdit = this._currentViewingPerson;
      this._closeInfoModal();
      this._openPersonModal(personToEdit);
    }
  }

  /**
   * Opens media viewer
   * @param {Array} files - Array of files
   * @param {number} index - Starting index
   */
  _openMediaViewer(files, index) {
    this._mediaFiles = files;
    this._currentMediaIndex = index;
    this._showMedia();
    document.getElementById('mediaViewerModal').style.display = 'block';
    logger.info('UI', 'Media viewer opened', { index });
  }

  /**
   * Shows current media
   */
  _showMedia() {
    const file = this._mediaFiles[this._currentMediaIndex];
    const imgElement = document.getElementById('mediaImage');
    const fileElement = document.getElementById('mediaFile');
    
    if (file.type && file.type.startsWith('image/')) {
      imgElement.src = file.data;
      imgElement.style.display = 'block';
      fileElement.style.display = 'none';
    } else {
      document.getElementById('mediaFileName').textContent = file.name;
      imgElement.style.display = 'none';
      fileElement.style.display = 'flex';
    }
    
    document.getElementById('mediaCounter').textContent = `${this._currentMediaIndex + 1} / ${this._mediaFiles.length}`;
  }

  /**
   * Shows previous media
   */
  _showPreviousMedia() {
    this._currentMediaIndex = (this._currentMediaIndex - 1 + this._mediaFiles.length) % this._mediaFiles.length;
    this._showMedia();
  }

  /**
   * Shows next media
   */
  _showNextMedia() {
    this._currentMediaIndex = (this._currentMediaIndex + 1) % this._mediaFiles.length;
    this._showMedia();
  }

  /**
   * Downloads current media
   */
  _downloadCurrentMedia() {
    const file = this._mediaFiles[this._currentMediaIndex];
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    link.click();
    logger.info('UI', 'Media downloaded', { fileName: file.name });
  }

  /**
   * Closes media viewer
   */
  _closeMediaViewer() {
    document.getElementById('mediaViewerModal').style.display = 'none';
    this._mediaFiles = null;
    this._currentMediaIndex = 0;
  }

  /**
   * Views files of selected person
   */
  _viewFiles() {
    if (!this._canvas._selectedPerson) return;

    const files = this._canvas._selectedPerson.getFiles();
    const filesList = document.getElementById('filesList');
    filesList.innerHTML = '';

    if (files.length === 0) {
      filesList.innerHTML = `<p>${i18n.t('noFilesAttached')}</p>`;
    } else {
      files.forEach(file => {
        const div = document.createElement('div');
        div.className = 'file-view-item';
        
        if (file.type.startsWith('image/')) {
          div.innerHTML = `<strong>${file.name}</strong><br><img src="${file.data}" alt="${file.name}">`;
        } else {
          div.innerHTML = `<strong>${file.name}</strong>`;
          div.onclick = () => {
            const link = document.createElement('a');
            link.href = file.data;
            link.download = file.name;
            link.click();
          };
        }
        
        filesList.appendChild(div);
      });
    }

    document.getElementById('filesModal').style.display = 'block';
    this._hideContextMenu();
  }

  /**
   * Closes files modal
   */
  _closeFilesModal() {
    document.getElementById('filesModal').style.display = 'none';
  }

  /**
   * Deletes selected person
   */
  _deleteSelectedPerson() {
    if (!this._canvas._selectedPerson) return;

    if (confirm(i18n.t('confirmDelete'))) {
      this._familyTree.deletePerson(this._canvas._selectedPerson.getId());
      this._canvas._selectedPerson = null;
      this._familyTree.saveToLocalStorage();
      this._canvas.render();
    }

    this._hideContextMenu();
  }

  /**
   * Activates focus mode
   */
  _activateFocusMode() {
    this._focusModeActive = true;
    const focusBtn = document.getElementById('focusBtn');
    focusBtn.classList.add('btn-active');
    focusBtn.textContent = 'Focus: Select Person';
    console.log('Focus mode activated, _focusModeActive =', this._focusModeActive);
    alert('Focus Mode: Click on any person to view only their direct relatives (parents, siblings, spouses, and children). Click \"Show All\" to exit focus mode.');
    logger.info('UI', 'Focus mode activated');
  }

  /**
   * Deactivates focus mode
   */
  _deactivateFocusMode() {
    this._focusModeActive = false;
    const focusBtn = document.getElementById('focusBtn');
    focusBtn.classList.remove('btn-active');
    focusBtn.textContent = 'Focus';
    logger.info('UI', 'Focus mode deactivated');
  }

  /**
   * Exports family tree to JSON
   */
  _exportJSON() {
    const json = this._familyTree.exportToJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `family-tree-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    alert(i18n.t('exportSuccess'));
    logger.info('UI', 'JSON exported');
  }

  /**
   * Opens backups modal
   */
  _openBackupsModal() {
    const backups = backupManager.getBackups();
    const container = document.getElementById('backupsList');
    container.innerHTML = '';

    if (backups.length === 0) {
      container.innerHTML = '<p style="color: #999; text-align: center; padding: 2rem;">No backups available yet.</p>';
    } else {
      backups.reverse().forEach((backup, index) => {
        const realIndex = backups.length - 1 - index;
        const date = new Date(backup.timestamp);
        const div = document.createElement('div');
        div.style.cssText = 'background: #f9f9f9; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;';
        div.innerHTML = `
          <div>
            <strong style="color: #667eea;">${date.toLocaleString()}</strong>
            <div style="color: #666; font-size: 0.9rem; margin-top: 0.3rem;">Size: ${backup.size}</div>
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn-primary" style="padding: 0.5rem 1rem;" onclick="ui._restoreBackup(${realIndex})">Restore</button>
            <button class="btn-secondary" style="padding: 0.5rem 1rem;" onclick="backupManager.exportBackup(${realIndex})">Export</button>
            <button class="btn-secondary" style="padding: 0.5rem 1rem; background: #ff4444; border-color: #ff4444;" onclick="ui._deleteBackup(${realIndex})">Delete</button>
          </div>
        `;
        container.appendChild(div);
      });
    }

    document.getElementById('backupsModal').style.display = 'block';
    logger.info('UI', 'Backups modal opened');
  }

  /**
   * Closes backups modal
   */
  _closeBackupsModal() {
    document.getElementById('backupsModal').style.display = 'none';
  }

  /**
   * Restores backup
   * @param {number} index - Backup index
   */
  _restoreBackup(index) {
    if (confirm('Are you sure you want to restore this backup? Current data will be replaced.')) {
      if (backupManager.restoreBackup(index)) {
        alert('Backup restored successfully! Reloading page...');
        window.location.reload();
      } else {
        alert('Failed to restore backup.');
      }
    }
  }

  /**
   * Deletes backup
   * @param {number} index - Backup index
   */
  _deleteBackup(index) {
    if (confirm('Are you sure you want to delete this backup?')) {
      if (backupManager.deleteBackup(index)) {
        this._openBackupsModal();
      } else {
        alert('Failed to delete backup.');
      }
    }
  }

  /**
   * Imports family tree from JSON
   * @param {File} file - JSON file
   */
  _importJSON(file) {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        this._familyTree.importFromJSON(e.target.result);
        this._familyTree.saveToLocalStorage();
        this._canvas.render();
        this._canvas.centerView();
        alert(i18n.t('importSuccess'));
        logger.info('UI', 'JSON imported');
      } catch (error) {
        alert(i18n.t('importError'));
        logger.error('UI', 'JSON import failed', error);
      }
    };
    reader.readAsText(file);
  }

  /**
   * Adds child directly by creating new person
   */
  _addChildDirectly() {
    if (!this._canvas._selectedPerson) {
      console.error('No person selected');
      return;
    }

    const parent = this._canvas._selectedPerson;
    this._hideContextMenu();
    
    const firstName = prompt(i18n.t('firstName') + ':');
    if (!firstName) return;
    
    const lastName = prompt(i18n.t('lastName') + ':', parent.getLastName());
    if (!lastName) return;

    const child = this._familyTree.createPerson(firstName, lastName);
    child.setX(parent.getX() + 200);
    child.setY(parent.getY() + 150);
    
    this._familyTree.addParentChildRelationship(parent.getId(), child.getId());
    this._familyTree.saveToLocalStorage();
    this._canvas.render();
    
    console.log(`Created child ${child.getFullName()} for ${parent.getFullName()}`);
    logger.info('UI', 'Child created', { parentId: parent.getId(), childId: child.getId() });
  }

  /**
   * Adds parents (couple) directly by creating mother and father
   */
  _addParentsDirectly() {
    if (!this._canvas._selectedPerson) {
      console.error('No person selected');
      return;
    }

    const child = this._canvas._selectedPerson;
    
    if (child.getMother() && child.getFather()) {
      alert(i18n.t('hasParentsAlready'));
      this._hideContextMenu();
      logger.error('UI', 'Cannot add parents - child already has both');
      return;
    }
    
    this._hideContextMenu();
    
    const fatherFirstName = prompt(i18n.t('fatherFirstName') + ':');
    if (!fatherFirstName) return;
    
    const fatherLastName = prompt(i18n.t('fatherLastName') + ':', child.getLastName());
    if (!fatherLastName) return;

    const father = this._familyTree.createPerson(fatherFirstName, fatherLastName, 'male');
    father.setX(child.getX() - 250);
    father.setY(child.getY() - 150);
    
    const motherFirstName = prompt(i18n.t('motherFirstName') + ':');
    if (!motherFirstName) return;
    
    const motherLastName = prompt(i18n.t('motherLastName') + ':', child.getLastName());
    if (!motherLastName) return;

    const mother = this._familyTree.createPerson(motherFirstName, motherLastName, 'female');
    mother.setX(child.getX() + 50);
    mother.setY(child.getY() - 150);
    
    mother.addSpouse(father.getId());
    father.addSpouse(mother.getId());
    
    child.setMother(mother.getId());
    child.setFather(father.getId());
    mother.addChild(child.getId());
    father.addChild(child.getId());
    
    this._familyTree.saveToLocalStorage();
    this._canvas.render();
    
    logger.info('UI', 'Parents created', { 
      childId: child.getId(), 
      motherId: mother.getId(),
      fatherId: father.getId() 
    });
  }

  /**
   * Adds brother directly by creating sibling with same parents
   */
  _addBrotherDirectly() {
    if (!this._canvas._selectedPerson) {
      console.error('No person selected');
      return;
    }

    const person = this._canvas._selectedPerson;
    
    if (!person.getMother() && !person.getFather()) {
      alert(i18n.t('noParentsForSiblings'));
      this._hideContextMenu();
      logger.error('UI', 'Cannot add brother - person has no parents');
      return;
    }
    
    this._hideContextMenu();
    
    const firstName = prompt(i18n.t('brotherFirstName') + ':');
    if (!firstName) return;
    
    const lastName = prompt(i18n.t('brotherLastName') + ':', person.getLastName());
    if (!lastName) return;

    const brother = this._familyTree.createPerson(firstName, lastName, 'male');
    brother.setX(person.getX() + 200);
    brother.setY(person.getY());
    
    if (person.getMother()) {
      brother.setMother(person.getMother());
      const mother = this._familyTree.getPerson(person.getMother());
      if (mother) mother.addChild(brother.getId());
    }
    
    if (person.getFather()) {
      brother.setFather(person.getFather());
      const father = this._familyTree.getPerson(person.getFather());
      if (father) father.addChild(brother.getId());
    }
    
    this._familyTree.saveToLocalStorage();
    this._canvas.render();
    
    logger.info('UI', 'Brother created', { siblingId: person.getId(), brotherId: brother.getId() });
  }

  /**
   * Adds sister directly by creating sibling with same parents
   */
  _addSisterDirectly() {
    if (!this._canvas._selectedPerson) {
      console.error('No person selected');
      return;
    }

    const person = this._canvas._selectedPerson;
    
    if (!person.getMother() && !person.getFather()) {
      alert(i18n.t('noParentsForSiblings'));
      this._hideContextMenu();
      logger.error('UI', 'Cannot add sister - person has no parents');
      return;
    }
    
    this._hideContextMenu();
    
    const firstName = prompt(i18n.t('sisterFirstName') + ':');
    if (!firstName) return;
    
    const lastName = prompt(i18n.t('sisterLastName') + ':', person.getLastName());
    if (!lastName) return;

    const sister = this._familyTree.createPerson(firstName, lastName, 'female');
    sister.setX(person.getX() + 200);
    sister.setY(person.getY());
    
    if (person.getMother()) {
      sister.setMother(person.getMother());
      const mother = this._familyTree.getPerson(person.getMother());
      if (mother) mother.addChild(sister.getId());
    }
    
    if (person.getFather()) {
      sister.setFather(person.getFather());
      const father = this._familyTree.getPerson(person.getFather());
      if (father) father.addChild(sister.getId());
    }
    
    this._familyTree.saveToLocalStorage();
    this._canvas.render();
    
    logger.info('UI', 'Sister created', { siblingId: person.getId(), sisterId: sister.getId() });
  }

  /**
   * Adds spouse directly by creating new person
   */
  _addSpouseDirectly() {
    if (!this._canvas._selectedPerson) {
      console.error('No person selected');
      return;
    }

    const person = this._canvas._selectedPerson;
    this._hideContextMenu();
    
    const firstName = prompt(i18n.t('firstName') + ':');
    if (!firstName) return;
    
    const lastName = prompt(i18n.t('lastName') + ':');
    if (!lastName) return;

    const spouse = this._familyTree.createPerson(firstName, lastName);
    spouse.setX(person.getX() + 200);
    spouse.setY(person.getY());
    
    this._familyTree.addSpouseRelationship(person.getId(), spouse.getId());
    this._familyTree.saveToLocalStorage();
    this._canvas.render();
    
    console.log(`Created spouse ${spouse.getFullName()} for ${person.getFullName()}`);
    logger.info('UI', 'Spouse created', { person1Id: person.getId(), person2Id: spouse.getId() });
  }
}
