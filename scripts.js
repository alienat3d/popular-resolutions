/* === */
// This script dynamically changes the favicon based on the user's system color scheme preference (dark or light mode).
const favicon = document.getElementById('favicon');

function switchFavicon(evt) {
  if (evt.matches) {
    // System is in Dark Mode
    favicon.href = './favicon/favicon-dark.png';
  } else {
    // System is in Light Mode
    favicon.href = './favicon/favicon-light.png';
  }
}

const matcher = window.matchMedia('(prefers-color-scheme: dark)');
matcher.addEventListener('change', switchFavicon);

switchFavicon(matcher);
/* / === */

const whereAtButton = document.querySelector('.where-at');
const tbody = document.querySelector('.resolutions-list tbody');
const widthSorting = document.querySelector('.width-header');
const heightSorting = document.querySelector('.height-header');
const portionSorting = document.querySelector('.portion-header');

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

widthSorting.addEventListener('click', () => {
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
