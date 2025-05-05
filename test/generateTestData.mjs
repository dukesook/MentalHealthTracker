import mongoose from 'mongoose';
import userModel from '../models/user.mjs';
import dailyCheckinModel from '../models/daily_checkin.mjs';
import questionsModel from '../models/questions.mjs';
import scoresModel from '../models/scores.mjs';
import * as UserUtils from '../utils/userUtils.js';
import * as Database from '../controllers/database.mjs';
import * as TestHandler from '../controllers/testHandler.js';
import { faker } from '@faker-js/faker';


export default async function add_test_data() {
  
  Database.create_base_collections();

  // Current User
  const current_user_id = UserUtils.get_current_user_id();
  add_data_to_user(current_user_id, 100);

  // Extra Users
  for (const u of sample_users) {
    // const user = await UserUtils.create_new_user(u.first_name, u.middle_name, u.last_name, u.password)
    // add_data_to_user(user._id);
  }

}


async function add_data_to_user(userId, numCheckins = 10) {

  // Checkins
  for (let i = 0; i < numCheckins; i++) {
    const {user_id, check_in_date, mood, selected_prompt, journal_entry} = generate_daily_checkin(userId);
    Database.createDailyCheckin(user_id, check_in_date, mood, selected_prompt, journal_entry);
  }

  const fakeRes = {render: function() { } };

  // ADHD
  const adhdResult = create_adhd_test_results();
  await TestHandler.run_adhd_test(userId, adhdResult, fakeRes, 'adhd');
  
  // Depression
  const depressionResult = create_depression_test_results();
  await TestHandler.run_depression_test(userId, depressionResult, fakeRes, 'depression');
  
  // PTSD Test
  const ptsdResult = create_ptsd_test_results();
  await TestHandler.run_ptsd_test(userId, ptsdResult, fakeRes, 'ptsd');
}


function create_ptsd_test_results() {
  const results = {
    selected_test: 'ptsd',
    Q1: 'yes',
    Q2: 'no',
    Q3: 'yes',
    Q4: 'no',
    Q5: 'yes',
  }
  return results;
}

function create_adhd_test_results() {
  const answers = ['never', 'rarely', 'sometimes', 'often', 'very_often'];
  const results = {
    selected_test: 'adhd',
    Q1: 'never',
    Q2: 'rarely',
    Q3: 'sometimes',
    Q4: 'often',
    Q5: 'very_often',
    Q6: 'never',
    Q7: 'rarely',
    Q8: 'sometimes',
    Q9: 'often',
    Q10: 'very_often',
    Q11: 'never',
    Q12: 'rarely',
    Q13: 'sometimes',
    Q14: 'often',
    Q15: 'very_often',
    Q16: 'never',
    Q17: 'rarely',
    Q18: 'sometimes'
  }
  return results;
}

function create_depression_test_results() {
  const answers = ['not_at_all', 'several_days', 'more_than_half_the_days', 'nearly_every_day'];
  const results = {
    selected_test: 'depression',
    Q1: 'not_at_all',
    Q2: 'several_days',
    Q3: 'more_than_half_the_days',
    Q4: 'nearly_every_day',
    Q5: 'not_at_all',
    Q6: 'several_days',
    Q7: 'more_than_half_the_days',
    Q8: 'nearly_every_day',
    Q9: 'not_at_all',

  }
  
  return results;
}

const sample_users = [
  {
    // _id: new mongoose.Types.ObjectId('6806edccfffab1e8c74dd2cc'),
    first_name: 'Brittany',
    middle_name: 'boui.1',
    last_name: 'Buttcheeks',
    password: 'big_butt_lover'
  },
  {
    // _id: new mongoose.Types.ObjectId('6806ee2dfffab1e8c74dd2d5'),
    first_name: 'Desiree',
    middle_name: 'dez2413',
    last_name: 'Tetsu',
    password: 'jellybeans123'
  }
];


function generate_daily_checkin(user_id) {
  const moods = ['happy', 'sad', 'mad', 'neutral'];
  const randomMood = moods[Math.floor(Math.random() * moods.length)];
  const randomJournal = 'This is a sample journal entry.';
  const randomDate = new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 30)); // Random date within the last month
  const dailyCheckin = {
    user_id: user_id,
    check_in_date: faker.date.anytime(),
    mood: randomMood,
    selected_prompt: faker.lorem.sentence(),
    journal_entry: faker.lorem.paragraph(),
  }
  return dailyCheckin;
}


