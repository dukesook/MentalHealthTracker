import mongoose from 'mongoose';
import userModel from '../models/user.mjs';
import dailyCheckinModel from '../models/daily_checkin.mjs';
import questionsModel from '../models/questions.mjs';
import scoresModel from '../models/scores.mjs';

export default async function add_test_data() {
  add_data(userModel, sample_users);
  add_data(dailyCheckinModel, sample_daily_checkins);
  add_data(scoresModel, sample_scores);
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
    console.error("Error adding document. Model:", model.modelName, "Document:", document);
    console.error("Error Message:", err);
    throw err;
  });
}


const sample_users = [
  {
    _id: new mongoose.Types.ObjectId('6806edccfffab1e8c74dd2cc'),
    first_name: 'Brittany',
    middle_name: 'boui.1',
    last_name: 'Buttcheeks',
    password: 'big_butt_lover'
  },
  {
    _id: new mongoose.Types.ObjectId('6806ee2dfffab1e8c74dd2d5'),
    first_name: 'Desiree',
    middle_name: 'dez2413',
    last_name: 'Tetsu',
    password: 'jellybeans123'
  }
];


const sample_daily_checkins = [
  {
    user_id: sample_users[0].user_id,
    check_in_date: new Date('2023-01-01'),
    mood: 'happy',
    journal: 'Had a great day!'
  },
  {
    user_id: sample_users[0].user_id,
    check_in_date: new Date('2023-02-01'),
    mood: 'happy',
    journal: 'Had another great day!'
  },
  {
    user_id: sample_users[0].user_id,
    check_in_date: new Date('2023-03-01'),
    mood: 'mad',
    journal: 'My boss was rude.'
  },
  {
    user_id: sample_users[0].user_id,
    check_in_date: new Date('2024-04-05'),
    mood: 'neutral',
    journal: 'Just having a normal day.'
  },
  {
    user_id: sample_users[1].user_id,
    check_in_date: new Date('2023-02-01'),
    mood: 'sad',
    journal: 'Feeling down today.'
  },
  {
    user_id: sample_users[1].user_id,
    check_in_date: new Date('2023-03-03'),
    mood: 'sad',
    journal: 'My dog died.'
  },
  {
    user_id: sample_users[1].user_id,
    check_in_date: new Date('2023-04-10'),
    mood: 'sad',
    journal: 'I got dumped.'
  },
  {
    user_id: sample_users[1].user_id,
    check_in_date: new Date('2023-09-09'),
    mood: 'mad',
    journal: 'I broke my foot.'
  },
];

const sample_scores = [
  {
    user_id: sample_users[0].user_id,
    date_taken: new Date('2023-01-01'),
    Q1: 1,
    Q2: 1,
    Q3: 1,
    Q4: 1,
    Q5: 1,
    Q6: 1,
    Q7: 1,
    Q8: 1,
    Q9: 1
  },
  {
    user_id: sample_users[1].user_id,
    date_taken: new Date('2023-02-01'),
    Q1: 2,
    Q2: 2,
    Q3: 2,
    Q4: 2,
    Q5: 2,
    Q6: 2,
    Q7: 2,
    Q8: 2,
    Q9: 2
  }
]