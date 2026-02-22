let familyTree, canvas, ui;

window.addEventListener('DOMContentLoaded', () => {
  console.log('=== DOMContentLoaded ===');
  console.log('Checking authentication...');
  
  if (!auth.isAuthenticated()) {
    console.log('User NOT authenticated, redirecting to login...');
    window.location.href = 'login.html';
    return;
  }
  
  console.log('User IS authenticated, initializing app');
  initializeApp();
});

function initializeApp() {
  try {
    console.log('Initializing Family Tree Application...');
    
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    i18n.setLanguage(savedLanguage);
    document.getElementById('languageSelector').value = savedLanguage;
    console.log('UI language initialized:', savedLanguage);
    
    familyTree = new FamilyTree();
    console.log('FamilyTree created');
    
    const canvasElement = document.getElementById('familyCanvas');
    if (!canvasElement) {
      throw new Error('Canvas element not found!');
    }
    console.log('Canvas element found');
    
    canvas = new FamilyCanvas(canvasElement, familyTree);
    console.log('FamilyCanvas created');
    
    ui = new UI(familyTree, canvas);
    console.log('UI created');
    
    canvas.setUI(ui);
    console.log('UI reference set in canvas');

    familyTree.loadFromLocalStorage();
    console.log('Data loaded from localStorage');
    
    canvas.render();
    console.log('Canvas rendered');

    if (familyTree.getAllPersons().length > 0) {
      canvas.centerView();
      console.log('View centered');
    }

    logger.info('App', 'Application started successfully');
    console.log('✓ Family Tree Application initialized successfully!');
    console.log('✓ You can now add persons and create relationships');
    
    document.getElementById('logoutBtn').addEventListener('click', () => {
      if (confirm('Are you sure you want to logout?')) {
        auth.logout();
      }
    });
    
  } catch (error) {
    console.error('Failed to initialize application:', error);
    logger.error('App', 'Initialization failed', error);
    alert('Application failed to start. Check console for details.');
  }
}
