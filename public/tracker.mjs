const debugButton = document.getElementById('debugButton');
const cardListContainer = document.getElementById('card-list');
const displayedCardHTML = document.getElementById('displayed-card');
const userIdString = document.getElementById('user_id').value;
const moodHTML = document.getElementById('mood');
const filterButton = document.getElementById('filter-button');
const clearFilterButton = document.getElementById('clear-filter-button');

let g_checkins = null;

document.addEventListener('DOMContentLoaded', function() {
  
  requestCheckins().then((checkins) => {
    g_checkins = checkins;

    // Sanity Check
    assertIsCheckin(g_checkins[0]);
    
    // Sort By Date
    g_checkins.sort((a, b) => new Date(b.check_in_date) - new Date(a.check_in_date));
    
    displayCheckins(g_checkins, cardListContainer);

    filterButton.onclick = () => {
      const mood = moodHTML.value;
      const filteredCheckins = g_checkins.filter(checkin => checkin.mood === mood);
      displayCheckins(filteredCheckins, cardListContainer);
    }

    clearFilterButton.onclick = () => {
      displayCheckins(g_checkins, cardListContainer);
      moodHTML.value = ''; // Clear the mood selection
    }
  })

  debugButton.onclick = debug;
});


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


function displayCheckins(checkins, container) {
  container.innerHTML = '';

  for (const checkin of checkins) {
    const card = createCheckinCard(checkin);
    container.appendChild(card);
  }
}


function createCheckinCard(checkin, cardElement = null) {
  if (!cardElement) {
    cardElement = document.createElement('div');
  }
  const { check_in_date, mood, selected_prompt, journal_entry } = checkin;

  const date = new Date(check_in_date).toDateString();
  cardElement.className = 'card';
  cardElement.innerHTML = `
    <h3>${date}</h3>
    <p><strong>Mood</strong>: ${mood}</p>
    <p><strong>Prompt</strong>: ${selected_prompt}</p>
    `;
  
    // On Click
    cardElement.onclick = () => {
      displayedCardHTML.innerHTML = cardElement.innerHTML;
      displayedCardHTML.innerHTML += `<p><strong>Journal</strong>: ${journal_entry}</p>`;
      displayedCardHTML.style.maxWidth = '50%';
    }

  return cardElement;
}


function assertIsCheckin(checkin) {
  if (!checkin || typeof checkin !== 'object') {
    throw new Error('Invalid checkin object');
  }
  if (!checkin.check_in_date || !checkin.mood || !checkin.selected_prompt || !checkin.journal_entry) {
    throw new Error('Checkin object is missing required properties');
  }
}

async function debug() {
  // Filter by Mood
  const mood = moodHTML.value;
  const filteredCheckins = g_checkins.filter(checkin => checkin.mood === mood);
  displayCheckins(filteredCheckins, cardListContainer);
}