const debugButton = document.getElementById('debugButton');
const checkinsContainer = document.getElementsByClassName('checkins-container')[0];
const userIdString = document.getElementById('user_id').value;


document.addEventListener('DOMContentLoaded', function() {


  debugButton.onclick = debug;


  requestCheckins().then((checkins) => {
    displayDailyCheckins(checkins);
  })
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


function displayDailyCheckins(checkins) {
  // Sort checkins by date
  checkins.sort((a, b) => new Date(b.check_in_date) - new Date(a.check_in_date));

  for (const checkin of checkins) {
    const card = createCheckinCard(checkin.check_in_date, checkin.mood, checkin.selected_prompt, checkin.journal_entry);
    checkinsContainer.appendChild(card);
  }
}


function createCheckinCard(date, mood, prompt, journal) {

  date = new Date(date);
  date = date.toDateString();
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <h3>${date}</h3>
    <p><strong>Mood</strong>: ${mood}</p>
    <p><strong>Prompt</strong>: ${prompt}</p>
    <p><strong>Journal</strong>: ${journal}</p>
  `;
  return card;
}


async function debug() {

}
