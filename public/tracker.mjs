const debugButton = document.getElementById('debugButton');
const cardListContainer = document.getElementById('card-list');
const currentCardHTML = document.getElementById('current-card');
const userIdString = document.getElementById('user_id').value;


document.addEventListener('DOMContentLoaded', function() {


  debugButton.onclick = debug;


  requestCheckins().then((checkins) => {
    displayDailyCheckins(checkins);
    createCheckinCard(checkins[0], currentCardHTML);
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
  // Sort By Date
  checkins.sort((a, b) => new Date(b.check_in_date) - new Date(a.check_in_date));

  for (const checkin of checkins) {
    const card = createCheckinCard(checkin);
    cardListContainer.appendChild(card);
  }
}


function createCheckinCard(checkin, cardElement = null) {
  const { check_in_date, mood, selected_prompt, journal_entry } = checkin;
  if (!cardElement) {
    cardElement = document.createElement('div');
  }
  const date = new Date(check_in_date).toDateString();
  cardElement.className = 'card';
  cardElement.innerHTML = `
    <h3>${date}</h3>
    <p><strong>Mood</strong>: ${mood}</p>
    <p><strong>Prompt</strong>: ${selected_prompt}</p>
    `;
    cardElement.onclick = () => {
      currentCardHTML.innerHTML = cardElement.innerHTML;
      currentCardHTML.innerHTML += `<p><strong>Journal</strong>: ${journal_entry}</p>`;
      currentCardHTML.style.maxWidth = '50%';
    }
  return cardElement;
}


async function debug() {

}
