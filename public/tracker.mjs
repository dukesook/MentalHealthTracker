

const resultsContainer = document.getElementById('results');
const debugButton = document.getElementById('debugButton');
const userId = document.getElementById('user_id').value;
const dailyCheckinsButton = document.getElementById('dailyCheckinsButton');


document.addEventListener('DOMContentLoaded', function() {
  const collectionButtons = document.querySelectorAll('.collection-button');
  for (const button of collectionButtons) {
    button.onclick = () => {
      const collectionName = button.id;
      displayCollection(collectionName);
    }
  }

  debugButton.onclick = debug;

  dailyCheckinsButton.onclick = displayDailyCheckins;
});



async function displayCollection(collection) {
  const results = await requestCollection(collection)
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

export async function requestCollection(collection) {
  const data = {
    collection: collection
  }
  const queryString = new URLSearchParams(data).toString();
  let fetchRequest = `/query/all?${queryString}`;
  const httpResponse = await fetch(fetchRequest);
  const results = await httpResponse.json();
  return results;
}

export async function requestCheckins() {
  const fetchRequest = '/query/?collection=dailycheckins';
  const httpResponse = await fetch(fetchRequest);
  const results = await httpResponse.json();
  return results;
}

async function displayDailyCheckins() {
  const checkins = await requestCheckins();
  displayResults(checkins);
}

async function debug() {

}
