class I18n {
  constructor() {
    this._currentLanguage = 'en';
    this._translations = {
      en: {
        appTitle: 'Family Tree',
        addPerson: 'Add Person',
        exportJson: 'Export JSON',
        importJson: 'Import JSON',
        personDetails: 'Person Details',
        firstName: 'First Name',
        lastName: 'Last Name',
        birthday: 'Birthday',
        deathday: 'Death Day',
        photo: 'Profile Photo',
        info: 'Information',
        files: 'Attachments',
        save: 'Save',
        cancel: 'Cancel',
        addChild: 'Add Child',
        addParent: 'Add Parent',
        addSpouse: 'Add Spouse',
        edit: 'Edit',
        viewInfo: 'View Information',
        viewFiles: 'View Files',
        delete: 'Delete',
        attachedFiles: 'Attached Files',
        close: 'Close',
        personInformation: 'Person Information',
        information: 'Information',
        relationships: 'Relationships',
        attachments: 'Attachments',
        noInformation: 'No information provided',
        noRelationships: 'No relationships',
        noAttachments: 'No attachments',
        parent: 'Parent',
        child: 'Child',
        spouse: 'Spouse',
        notSpecified: 'Not specified',
        confirmDelete: 'Are you sure you want to delete this person?',
        exportSuccess: 'Family tree exported successfully',
        importSuccess: 'Family tree imported successfully',
        importError: 'Error importing family tree',
        selectParent: 'Select parent by clicking on a person',
        selectSpouse: 'Select spouse by clicking on a person',
        selectChild: 'Select child by clicking on a person',
        gender: 'Gender',
        male: 'Male',
        female: 'Female',
        dataLink: 'Data Link',
        autoLayout: 'Auto Layout',
        addParents: 'Add Parents',
        addBrother: 'Add Brother',
        addSister: 'Add Sister',
        mother: 'Mother',
        father: 'Father',
        brother: 'Brother',
        sister: 'Sister',
        pleaseSelectPerson: 'Please select a person first',
        hasParentsAlready: 'This person already has both parents. A child can only have one mother and one father.',
        fatherFirstName: 'Father First Name',
        fatherLastName: 'Father Last Name',
        motherFirstName: 'Mother First Name',
        motherLastName: 'Mother Last Name',
        noParentsForSiblings: 'This person has no parents. Add parents first to create siblings.',
        brotherFirstName: 'Brother First Name',
        brotherLastName: 'Brother Last Name',
        sisterFirstName: 'Sister First Name',
        sisterLastName: 'Sister Last Name',
        noFilesAttached: 'No files attached',
        login: 'Login',
        username: 'Username',
        password: 'Password',
        loginButton: 'Sign In',
        logout: 'Logout',
        invalidCredentials: 'Invalid username or password',
        sessionExpired: 'Session expired. Please login again.'
      },
      de: {
        appTitle: 'Stammbaum',
        addPerson: 'Person hinzufügen',
        exportJson: 'JSON exportieren',
        importJson: 'JSON importieren',
        personDetails: 'Personendetails',
        firstName: 'Vorname',
        lastName: 'Nachname',
        birthday: 'Geburtstag',
        deathday: 'Todestag',
        photo: 'Profilbild',
        info: 'Information',
        files: 'Anhänge',
        save: 'Speichern',
        cancel: 'Abbrechen',
        addChild: 'Kind hinzufügen',
        addParent: 'Elternteil hinzufügen',
        addSpouse: 'Partner hinzufügen',
        edit: 'Bearbeiten',
        viewInfo: 'Informationen anzeigen',
        viewFiles: 'Dateien anzeigen',
        delete: 'Löschen',
        attachedFiles: 'Angehängte Dateien',
        close: 'Schließen',
        personInformation: 'Personeninformationen',
        information: 'Information',
        relationships: 'Beziehungen',
        attachments: 'Anhänge',
        noInformation: 'Keine Informationen vorhanden',
        noRelationships: 'Keine Beziehungen',
        noAttachments: 'Keine Anhänge',
        parent: 'Elternteil',
        child: 'Kind',
        spouse: 'Partner',
        notSpecified: 'Nicht angegeben',
        confirmDelete: 'Möchten Sie diese Person wirklich löschen?',
        exportSuccess: 'Stammbaum erfolgreich exportiert',
        importSuccess: 'Stammbaum erfolgreich importiert',
        importError: 'Fehler beim Importieren des Stammbaums',
        selectParent: 'Wählen Sie ein Elternteil durch Klicken auf eine Person',
        selectSpouse: 'Wählen Sie einen Partner durch Klicken auf eine Person',
        selectChild: 'Wählen Sie ein Kind durch Klicken auf eine Person',
        gender: 'Geschlecht',
        male: 'Männlich',
        female: 'Weiblich',
        dataLink: 'Datenlink',
        autoLayout: 'Auto-Layout',
        addParents: 'Eltern hinzufügen',
        addBrother: 'Bruder hinzufügen',
        addSister: 'Schwester hinzufügen',
        mother: 'Mutter',
        father: 'Vater',
        brother: 'Bruder',
        sister: 'Schwester',
        pleaseSelectPerson: 'Bitte wählen Sie zuerst eine Person aus',
        hasParentsAlready: 'Diese Person hat bereits beide Elternteile. Ein Kind kann nur eine Mutter und einen Vater haben.',
        fatherFirstName: 'Vorname des Vaters',
        fatherLastName: 'Nachname des Vaters',
        motherFirstName: 'Vorname der Mutter',
        motherLastName: 'Nachname der Mutter',
        noParentsForSiblings: 'Diese Person hat keine Eltern. Fügen Sie zuerst Eltern hinzu, um Geschwister zu erstellen.',
        brotherFirstName: 'Vorname des Bruders',
        brotherLastName: 'Nachname des Bruders',
        sisterFirstName: 'Vorname der Schwester',
        sisterLastName: 'Nachname der Schwester',
        noFilesAttached: 'Keine Dateien angehängt',
        login: 'Anmeldung',
        username: 'Benutzername',
        password: 'Passwort',
        loginButton: 'Anmelden',
        logout: 'Abmelden',
        invalidCredentials: 'Ungültiger Benutzername oder Passwort',
        sessionExpired: 'Sitzung abgelaufen. Bitte melden Sie sich erneut an.'
      },
      ru: {
        appTitle: 'Семейное древо',
        addPerson: 'Добавить человека',
        exportJson: 'Экспорт JSON',
        importJson: 'Импорт JSON',
        personDetails: 'Детали человека',
        firstName: 'Имя',
        lastName: 'Фамилия',
        birthday: 'День рождения',
        deathday: 'День смерти',
        photo: 'Фото профиля',
        info: 'Информация',
        files: 'Вложения',
        save: 'Сохранить',
        cancel: 'Отмена',
        addChild: 'Добавить ребенка',
        addParent: 'Добавить родителя',
        addSpouse: 'Добавить супруга',
        edit: 'Редактировать',
        viewInfo: 'Просмотр информации',
        viewFiles: 'Просмотр файлов',
        delete: 'Удалить',
        attachedFiles: 'Прикрепленные файлы',
        close: 'Закрыть',
        personInformation: 'Информация о человеке',
        information: 'Информация',
        relationships: 'Отношения',
        attachments: 'Вложения',
        noInformation: 'Информация отсутствует',
        noRelationships: 'Нет отношений',
        noAttachments: 'Нет вложений',
        parent: 'Родитель',
        child: 'Ребенок',
        spouse: 'Супруг',
        notSpecified: 'Не указано',
        confirmDelete: 'Вы уверены, что хотите удалить этого человека?',
        exportSuccess: 'Семейное древо успешно экспортировано',
        importSuccess: 'Семейное древо успешно импортировано',
        importError: 'Ошибка импорта семейного древа',
        selectParent: 'Выберите родителя, нажав на человека',
        selectSpouse: 'Выберите супруга, нажав на человека',
        selectChild: 'Выберите ребенка, нажав на человека',
        gender: 'Пол',
        male: 'Мужской',
        female: 'Женский',
        dataLink: 'Ссылка на данные',
        autoLayout: 'Авто-расположение',
        addParents: 'Добавить родителей',
        addBrother: 'Добавить брата',
        addSister: 'Добавить сестру',
        mother: 'Мать',
        father: 'Отец',
        brother: 'Брат',
        sister: 'Сестра',
        pleaseSelectPerson: 'Пожалуйста, сначала выберите человека',
        hasParentsAlready: 'У этого человека уже есть оба родителя. У ребенка может быть только одна мать и один отец.',
        fatherFirstName: 'Имя отца',
        fatherLastName: 'Фамилия отца',
        motherFirstName: 'Имя матери',
        motherLastName: 'Фамилия матери',
        noParentsForSiblings: 'У этого человека нет родителей. Сначала добавьте родителей, чтобы создать братьев и сестер.',
        brotherFirstName: 'Имя брата',
        brotherLastName: 'Фамилия брата',
        sisterFirstName: 'Имя сестры',
        sisterLastName: 'Фамилия сестры',
        noFilesAttached: 'Файлы не прикреплены',
        login: 'Вход',
        username: 'Имя пользователя',
        password: 'Пароль',
        loginButton: 'Войти',
        logout: 'Выйти',
        invalidCredentials: 'Неверное имя пользователя или пароль',
        sessionExpired: 'Сессия истекла. Пожалуйста, войдите снова.'
      }
    };
    logger.info('I18n', 'Initialized');
  }

  /**
   * Sets current language
   * @param {string} lang - Language code
   */
  setLanguage(lang) {
    if (this._translations[lang]) {
      this._currentLanguage = lang;
      logger.info('I18n', `Language changed to: ${lang}`);
      this._updateUI();
    } else {
      logger.warn('I18n', `Language not found: ${lang}`);
    }
  }

  /**
   * Gets translation for key
   * @param {string} key - Translation key
   * @returns {string} Translated text
   */
  t(key) {
    return this._translations[this._currentLanguage][key] || key;
  }

  /**
   * Updates UI with current language
   */
  _updateUI() {
    const elements = {
      'appTitle': this.t('appTitle'),
      'addPersonBtn': this.t('addPerson'),
      'exportBtn': this.t('exportJson'),
      'importBtn': this.t('importJson'),
      'modalTitle': this.t('personDetails'),
      'labelFirstName': this.t('firstName') + ':',
      'labelLastName': this.t('lastName') + ':',
      'labelBirthday': this.t('birthday') + ':',
      'labelDeathday': this.t('deathday') + ':',
      'labelPhoto': this.t('photo') + ':',
      'labelInfo': this.t('info') + ':',
      'labelFiles': this.t('files') + ':',
      'savePersonBtn': this.t('save'),
      'cancelBtn': this.t('cancel'),
      'addChild': this.t('addChild'),
      'addParent': this.t('addParent'),
      'addSpouse': this.t('addSpouse'),
      'editPerson': this.t('edit'),
      'viewInfo': this.t('viewInfo'),
      'viewFiles': this.t('viewFiles'),
      'deletePerson': this.t('delete'),
      'filesModalTitle': this.t('attachedFiles'),
      'closeFilesBtn': this.t('close'),
      'infoModalTitle': this.t('personInformation'),
      'labelInfoBirthday': this.t('birthday') + ':',
      'labelInfoDeathday': this.t('deathday') + ':',
      'labelInfoText': this.t('information') + ':',
      'labelInfoRelationships': this.t('relationships') + ':',
      'labelInfoAttachments': this.t('attachments') + ':',
      'editFromInfoBtn': this.t('edit'),
      'closeInfoBtn': this.t('close'),
      'labelGender': this.t('gender') + ':',
      'labelDataLink': this.t('dataLink') + ':',
      'autoLayoutBtn': this.t('autoLayout'),
      'addParents': this.t('addParents'),
      'addBrother': this.t('addBrother'),
      'addSister': this.t('addSister'),
      'logoutBtn': this.t('logout'),
      'loginModalTitle': this.t('login'),
      'labelUsername': this.t('username') + ':',
      'labelPassword': this.t('password') + ':',
      'loginSubmitBtn': this.t('loginButton')
    };
    
    Object.keys(elements).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = elements[id];
      }
    });
    
    const genderSelect = document.getElementById('gender');
    if (genderSelect) {
      genderSelect.options[0].text = this.t('male');
      genderSelect.options[1].text = this.t('female');
    }
  }

  /**
   * Gets current language
   * @returns {string} Current language code
   */
  getCurrentLanguage() {
    return this._currentLanguage;
  }
}

const i18n = new I18n();
