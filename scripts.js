/* === */
// This script dynamically changes the favicon based on the user's system color scheme preference (dark or light mode). Also check which mode is currently active and set the appropriate color theme accordingly.
const favicon = document.getElementById('favicon');
const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

if (darkModeQuery.matches) document.body.classList.add('dark-theme');

function switchFavicon(evt) {
  if (evt.matches) {
    // System is in Dark Mode
    favicon.href = './favicon/favicon-dark.png';
  } else {
    // System is in Light Mode
    favicon.href = './favicon/favicon-light.png';
  }
}

darkModeQuery.addEventListener('change', switchFavicon);

switchFavicon(darkModeQuery);
/* / === */
/* === */
// Change theme by trigger button.
const themeToggleButton = document.querySelector('.theme-toggle-input');

themeToggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
});
/* / === */
/* === */
// Main functionality: load resolutions data, render it in a table, and allow sorting by width, height, and portion. Also allows switching between Russian Federation and world resolutions.
const whereAtButton = document.querySelector('.where-at');
const tbody = document.querySelector('.resolutions-list tbody');
const widthSorting = document.querySelector('.width-header');
const heightSorting = document.querySelector('.height-header');
const portionSorting = document.querySelector('.portion-header');
const widthSortingIcon = widthSorting.querySelector('img');
const heightSortingIcon = heightSorting.querySelector('img');
const portionSortingIcon = portionSorting.querySelector('img');
const sortingIcons = [widthSortingIcon, heightSortingIcon, portionSortingIcon];

let pathsToDBArray = './db/russia-resolutions.json';

let resolutions = [];
let allResolutionsArray = [];
let isWidthDescending = true;
let isHeightDescending = true;
let isPortionDescending = true;
let isWhereAtWorld = false;

function renderTableRows(arr) {
  arr.forEach((obj, idx) => {
    tbody.insertAdjacentHTML(
      'beforeend',
      `
				<tr>
					<td>${++idx > 9 ? idx : `0${idx}`}</td>
					<td>${obj.width}</td>
					<td>${obj.height}</td>
					<td>${obj.portion}%</td>
				</tr>
			`,
    );
  });
}

async function loadResolutions() {
  try {
    const response = await fetch(pathsToDBArray);
    resolutions = await response.json();

    allResolutionsArray = [
      ...resolutions.desktop,
      ...resolutions.tablet,
      ...resolutions.mobile,
    ];
    renderTableRows(allResolutionsArray);
  } catch (error) {
    console.error('Error fetching resolutions data:', error);
  }
}

/**
 * Combines object arrays and sorts them by a specific property.
 * @param {Object} dataObj - The source object containing arrays.
 * @param {string} key - The property to sort by ('portion', 'width', 'height').
 * @param {boolean} descending - Sort highest-to-lowest if true, lowest-to-highest if false.
 */
function combineAndSort(dataObj, key, descending = true) {
  // 1. Combine all arrays from desktop, tablet, and mobile into one flat array
  const combinedArray = Object.values(dataObj).flat();

  // 2. Sort the array based on the chosen key
  return combinedArray.sort((a, b) => {
    if (descending) {
      return b[key] - a[key]; // Highest value first
    } else {
      return a[key] - b[key]; // Lowest value first
    }
  });
}

function toggleSortingIcon(iconImg, flag) {
  if (!iconImg.classList.contains('shown')) {
    sortingIcons.forEach((item) => {
      item !== iconImg ? item.classList.remove('shown') : null;
    });
    flag
      ? (iconImg.src = './img/sorting-descending.svg')
      : (iconImg.src = './img/sorting-ascending.svg');
    setTimeout(() => iconImg.classList.add('shown'), 0);
  } else {
    flag
      ? (iconImg.src = './img/sorting-descending.svg')
      : (iconImg.src = './img/sorting-ascending.svg');
  }
}

widthSorting.addEventListener('click', () => {
  toggleSortingIcon(widthSortingIcon, isWidthDescending);
  const sortedByWidthArray = combineAndSort(
    resolutions,
    'width',
    isWidthDescending,
  );
  tbody.innerHTML = '';
  renderTableRows(sortedByWidthArray);
  isWidthDescending = !isWidthDescending;
});

heightSorting.addEventListener('click', () => {
  toggleSortingIcon(heightSortingIcon, isHeightDescending);
  const sortedByHeightArray = combineAndSort(
    resolutions,
    'height',
    isHeightDescending,
  );
  tbody.innerHTML = '';
  renderTableRows(sortedByHeightArray);
  isHeightDescending = !isHeightDescending;
});

portionSorting.addEventListener('click', () => {
  toggleSortingIcon(portionSortingIcon, isPortionDescending);
  const sortedByPortionArray = combineAndSort(
    resolutions,
    'portion',
    isPortionDescending,
  );
  tbody.innerHTML = '';
  renderTableRows(sortedByPortionArray);
  isPortionDescending = !isPortionDescending;
});

whereAtButton.addEventListener('click', () => {
  isWhereAtWorld = !isWhereAtWorld;

  if (isWhereAtWorld) {
    whereAtButton.textContent = 'мире';
    pathsToDBArray = './db/world-resolutions.json';
  } else {
    whereAtButton.textContent = 'Российской Федерации';
    pathsToDBArray = './db/russia-resolutions.json';
  }

  tbody.innerHTML = '';
  loadResolutions();
});

loadResolutions();
/* / === */
