# Family Tree Application - Troubleshooting Guide

## How to View Logs

### Method 1: Browser Console (Recommended)
1. Open `index.html` in your browser
2. Press `F12` or right-click and select "Inspect"
3. Click on the "Console" tab
4. You should see detailed logs like:
   - `[Logger] Initialized`
   - `[I18n] Initialized`
   - `Initializing Family Tree Application...`
   - `FamilyTree created`
   - `Canvas element found`
   - etc.

### Method 2: Debug Page
1. Open `debug.html` in your browser
2. This shows all console output directly on the page
3. Errors will be in red, warnings in orange, info in green

### Method 3: Export Logs
Open browser console and type:
```javascript
logger.exportLogs()
```
This will show all logged events in JSON format.

Or save to file:
```javascript
const logs = logger.exportLogs();
const blob = new Blob([logs], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'familytree-logs.json';
a.click();
```

## Common Issues

### Issue: Cannot drag items
**Check console for:**
- "Mouse down event triggered" - should appear when you click
- "Person selected for dragging: person_X" - when clicking on a person
- "Canvas selected for panning" - when clicking empty space

**If you don't see these messages:**
- The canvas might not be capturing events
- JavaScript might have failed to load

### Issue: Cannot connect persons
**Steps to connect:**
1. Right-click on a person
2. Select "Add Child", "Add Parent", or "Add Spouse"
3. Click on another person to create the relationship

**Check console for:**
- "Relationship mode started" message
- Any errors when clicking

### Issue: Context menu doesn't appear
**Check console for:**
- JavaScript errors
- Whether UI class initialized properly

## Viewing LocalStorage Data

Open console and type:
```javascript
localStorage.getItem('familyTreeData')
```

To see formatted:
```javascript
JSON.parse(localStorage.getItem('familyTreeData'))
```

## Clear All Data

To start fresh:
```javascript
localStorage.clear()
location.reload()
```

## Enable Maximum Logging

All operations are automatically logged. Check console constantly while using the app.

## Test Basic Functionality

Run in console:
```javascript
// Test 1: Check if classes exist
console.log('FamilyTree:', typeof FamilyTree);
console.log('Person:', typeof Person);
console.log('FamilyCanvas:', typeof FamilyCanvas);

// Test 2: Check instances
console.log('familyTree:', familyTree);
console.log('canvas:', canvas);
console.log('ui:', ui);

// Test 3: Add a test person
const testPerson = familyTree.createPerson('Test', 'User');
testPerson.setX(200);
testPerson.setY(200);
canvas.render();
console.log('Test person created at (200, 200)');
```

## What to Look For in Console

### Successful Startup:
```
[Logger] Initialized
[I18n] Initialized
Initializing Family Tree Application...
FamilyTree created
Canvas element found
FamilyCanvas created
[FamilyCanvas] Initialized
UI created
[UI] Initialized
Data loaded from localStorage
Canvas rendered
Rendering 0 persons
✓ Family Tree Application initialized successfully!
```

### When Adding a Person:
```
[Person] Created person: John Doe
[FamilyTree] Person created
[UI] Person saved
Canvas rendered
Rendering 1 persons
```

### When Dragging:
```
Mouse down event triggered
Click position: (X, Y)
Person selected for dragging: person_1
[... mousemove events ...]
Person drag completed, saving...
Drag operation completed
```

## If Nothing Works

1. Check that all .js files are in the same folder as index.html
2. Check browser console for red error messages
3. Try opening debug.html first
4. Make sure you're using a modern browser (Chrome, Edge, Firefox)
5. Check if localStorage is enabled in your browser
