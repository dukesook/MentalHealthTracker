import userModel from '../models/user.mjs';
import dailyCheckinModel from '../models/daily_checkin.mjs';


export default async function add_test_data() {
  add_data(userModel, sample_users);
  add_data(dailyCheckinModel, sample_daily_checkins);
}


async function add_data(model, data) {
  for (let i = 0; i < data.length; i++) {
    const document = data[i];
    await add_document(model, document);
  }
}


async function add_document(model, document) {
  let newDocument = new model(document);
  await newDocument.save().then(() => {
    console.log("Test document added to database.");
  }).catch(err => {
    console.error("Error adding test document:", err);
    throw err;
  });
}


const sample_users = [
  {
    user_id: 'test_user1',
    password: 'test_password1'
  },
  {
    user_id: 'test_user2',
    password: 'test_password2'
  }
];


const sample_daily_checkins = [
  {
    user_id: 'test_user1',
    check_in_date: new Date('2023-01-01'),
    mood: 'happy',
    journal: 'Had a great day!'
  },
  {
    user_id: 'test_user2',
    check_in_date: new Date('2023-02-01'),
    mood: 'sad',
    journal: 'Feeling down today.'
  }
];