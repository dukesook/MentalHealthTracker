import Query from './query.mjs'

console.log('Query: ', Query)

const clearButton = document.getElementById('clearButton')
const resultsContainer = document.getElementById('results')

const collectionNames = [
  'dailycheckins', 'test_lists', 'test_questions', 'test_types', 'uesers',
]

document.addEventListener('DOMContentLoaded', function() {
  for (const collectionName of collectionNames) {

  }

  const collectionButtons = document.querySelectorAll('.collection-button');
  for (const button of collectionButtons) {
    button.onclick = () => {
      getCollection(button.id);
    }
  }

  clearButton.onclick = clear;
});


function clear() {
  resultsContainer.innerHTML = ''; // Clear previous results
}


async function getCollection(collection) {
  const results = await Query.entireCollection(collection)
  displayResults(results);
}


function displayResults(results) {
  resultsContainer.innerHTML = ''; // Clear previous results
  const dontDisplay = ['__v'];
  for (const result of results) {
    const li = document.createElement('li');
    
    let text = '';
    for (const key in result) {
      if (dontDisplay.includes(key)) {
        continue;
      }
      text += key + ': ' + result[key] + ', ';
    }

    text = text.slice(0, -2); // Remove the last comma and space

    li.textContent = text;
    resultsContainer.appendChild(li);
  }
}