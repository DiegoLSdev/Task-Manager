const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const itemListsEl = document.querySelectorAll('.drag-item-list');
const backlogListEl = document.getElementById('backlog-list');
const progressListEl = document.getElementById('progress-list');
const completeListEl = document.getElementById('complete-list');
const onHoldListEl = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [] //array of all previous arrays

// Drag Functionality
// ---->  https://www.w3schools.com/html/html5_draganddrop.asp
let draggedItem;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}


// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Filter Array to remove empty values
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.id = index;
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  listEl.setAttribute('ondragstart', 'drag(event)');

  // Create delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = '❌';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.addEventListener('click', () => deleteItem(column, index));

  // Append delete button to list item
  listEl.appendChild(deleteBtn);

  columnEl.appendChild(listEl);
}

// Function to delete an item from a column
function deleteItem(column, index) {
  const selectedArray = listArrays[column];
  selectedArray.splice(index, 1); // Remove the item from the array
  updateDOM(); // Update the DOM to reflect the changes
}


// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {

  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  backlogListEl.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogListEl, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressListEl.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressListEl, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeListEl.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeListEl, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldListEl.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldListEl, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Don't run more than once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumn[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumn[id].textContent;
    }
    updateDOM();
  }
}

// Add to Column List, Reset Textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM(column);
}

// Show Add Item Input Box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display = 'flex';
}

// Hide Item Input Box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display = 'none';
  addToColumn(column);
}

// Allows arrays to reflect Drag and Drop items
function rebuildArrays() {
  backlogListArray = [];
  for (let i = 0; i < backlogListEl.children.length; i++) {
    let itemText = backlogListEl.children[i].textContent.split('❌')[0].trim(); // Remove the delete button emoji and trim whitespace
    backlogListArray.push(itemText);
  }
  progressListArray = [];
  for (let i = 0; i < progressListEl.children.length; i++) {
    let itemText = progressListEl.children[i].textContent.split('❌')[0].trim(); // Remove the delete button emoji and trim whitespace
    progressListArray.push(itemText);
  }
  completeListArray = [];
  for (let i = 0; i < completeListEl.children.length; i++) {
    let itemText = completeListEl.children[i].textContent.split('❌')[0].trim(); // Remove the delete button emoji and trim whitespace
    completeListArray.push(itemText);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldListEl.children.length; i++) {
    let itemText = onHoldListEl.children[i].textContent.split('❌')[0].trim(); // Remove the delete button emoji and trim whitespace
    onHoldListArray.push(itemText);
  }
  updateDOM(); // Update the DOM after rebuilding the arrays
}
// WHEN ITEMS STARTS DRAGGING
function drag(e) {
  draggedItem = e.target;
  console.log(draggedItem)
}

// COLUMN ALLOWS FOR ITEM TO DROP  --> https://www.w3schools.com/html/html5_draganddrop.asp
function allowDrop(e) {
  e.preventDefault();
}

// wheen item enters column Area
function dragEnter(column) {
  itemListsEl[column].classList.add("over")
  currentColumn = column
}

// droping item to column --> https://www.w3schools.com/html/html5_draganddrop.asp
function drop(e) {
  e.preventDefault();
  //remove background color padding
  itemListsEl.forEach((column) => {
    column.classList.remove("over")
  });
  // Add item to Column
  const parent = itemListsEl[currentColumn];
  parent.appendChild(draggedItem)
  rebuildArrays()

}
// Function to apply custom gradient based on user input
function applyCustomGradient() {
  const startColor = document.getElementById('startColor').value;
  const endColor = document.getElementById('endColor').value;
  const customGradient = `linear-gradient(to right, ${startColor}, ${endColor})`;
  document.body.style.background = customGradient;

  // Store the colors in local storage
  localStorage.setItem('startColor', startColor);
  localStorage.setItem('endColor', endColor);
}

// Call the function to apply saved colors on page load
window.onload = applySavedColors;

const hoverIcon = document.getElementById('hoverIcon');
const gradientSettings = document.getElementById('gradientSettings');

hoverIcon.addEventListener('click', () => {
  if (gradientSettings.style.display === 'block') {
    gradientSettings.style.display = 'none';
    hoverIcon.classList.remove('open'); // Remove the open class to change the icon
  } else {
    gradientSettings.style.display = 'block';
    hoverIcon.classList.add('open'); // Add the open class to change the icon
  }
});

// Function to change header background color
function changeHeaderColor(column) {
  const colorInput = document.getElementById(getColorInputId(column));
  const selectedColumn = document.querySelectorAll('.header')[column];
  selectedColumn.style.backgroundColor = colorInput.value;
  // Save the color in local storage
  localStorage.setItem(getColorStorageKey(column), colorInput.value);
}

// Function to get the ID of color input
function getColorInputId(column) {
  switch (column) {
    case 0:
      return 'backlogColor';
    case 1:
      return 'progressColor';
    case 2:
      return 'completeColor';
    case 3:
      return 'onHoldColor';
    default:
      return '';
  }
}

// Function to get the local storage key for color
function getColorStorageKey(column) {
  switch (column) {
    case 0:
      return 'backlogColor';
    case 1:
      return 'progressColor';
    case 2:
      return 'completeColor';
    case 3:
      return 'onHoldColor';
    default:
      return '';
  }
}
// Call the function to apply saved header colors on page load
window.onload = () => {
  applySavedColors();
  applySavedHeaderColors();
};
// Function to change header background color
function changeBackgroundColor(startInputId, endInputId) {
  const startColorInput = document.getElementById(startInputId);
  const endColorInput = document.getElementById(endInputId);
  const customGradient = `linear-gradient(to right, ${startColorInput.value}, ${endColorInput.value})`;
  document.body.style.background = customGradient;

  // Store the colors in local storage
  localStorage.setItem('startColor', startColorInput.value);
  localStorage.setItem('endColor', endColorInput.value);
}

// Function to apply saved background colors on page load
function applySavedColors() {
  const savedStartColor = localStorage.getItem('startColor');
  const savedEndColor = localStorage.getItem('endColor');

  // Check if colors are present in local storage
  if (savedStartColor && savedEndColor) {
    const defaultGradient = `linear-gradient(to right, ${savedStartColor}, ${savedEndColor})`;
    document.body.style.background = defaultGradient;

    // Set the input values to the saved colors
    document.getElementById('startColor').value = savedStartColor;
    document.getElementById('endColor').value = savedEndColor;
  } else {
    // If no colors are saved, set default colors as red and blue
    document.getElementById('startColor').value = '#614533'; // red
    document.getElementById('endColor').value = '#7a6eb4'; // blue
    applyCustomGradient(); // Apply the default gradient
  }
}

// Call the function to apply saved background colors on page load
window.onload = () => {
  applySavedHeaderColors();
  applySavedBackgroundColors();
};

// Add event listeners to the color inputs to apply background color changes dynamically
document.getElementById('startColor').addEventListener('input', () => {
  changeBackgroundColor('startColor', 'endColor');
});

document.getElementById('endColor').addEventListener('input', () => {
  changeBackgroundColor('startColor', 'endColor');
});

// Function to change header background color
function changeHeaderColor(column, headerEl) {
  const colorInput = document.getElementById(getColorInputId(column));
  headerEl.style.backgroundColor = colorInput.value;
  // Save the color in local storage
  localStorage.setItem(getColorStorageKey(column), colorInput.value);
}

// Function to apply saved header colors on page load
function applySavedHeaderColors() {
  for (let i = 0; i < 4; i++) {
    const color = localStorage.getItem(getColorStorageKey(i));
    if (color) {
      const selectedColumn = document.querySelectorAll('.header')[i];
      selectedColumn.style.backgroundColor = color;

      // Set the input value of the corresponding color input
      document.getElementById(getColorInputId(i)).value = color;
    }
  }
}

// Add event listeners to the color inputs in headerColorSettings
document.getElementById('backlogColor').addEventListener('input', () => {
  changeHeaderColor(0, document.querySelectorAll('.header')[0]);
});

document.getElementById('progressColor').addEventListener('input', () => {
  changeHeaderColor(1, document.querySelectorAll('.header')[1]);
});

document.getElementById('completeColor').addEventListener('input', () => {
  changeHeaderColor(2, document.querySelectorAll('.header')[2]);
});

document.getElementById('onHoldColor').addEventListener('input', () => {
  changeHeaderColor(3, document.querySelectorAll('.header')[3]);
});

document.addEventListener("DOMContentLoaded", function () {
  var toggleButton = document.getElementById("hoverIcon");
  var dropdownMenu = document.getElementById("gradientSettings");

  toggleButton.addEventListener("click", function () {
    dropdownMenu.classList.toggle("show");
    toggleButton.classList.remove("open"); // Toggle the 'open' class on click
  });
});
// Call the function to apply saved header colors on page load
window.onload = () => {
  applySavedColors();
  applySavedHeaderColors();
};
//ON load
updateDOM();
// Run getSavedColumns only once, Update Local Storage
updatedOnLoad = true;
updateSavedColumns();
