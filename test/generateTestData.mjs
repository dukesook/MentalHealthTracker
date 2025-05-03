import mongoose from 'mongoose';
import userModel from '../models/user.mjs';
import dailyCheckinModel from '../models/daily_checkin.mjs';
import questionsModel from '../models/questions.mjs';
import scoresModel from '../models/scores.mjs';
import * as UserUtils from '../utils/userUtils.js';
import * as Database from '../controllers/database.mjs';
import { faker } from '@faker-js/faker';


export default async function add_test_data() {
  
  Database.create_base_collections();

  // Current User
  const current_user_id = UserUtils.get_current_user_id();
  add_data_to_user(current_user_id);

  // Extra Users
  for (const u of sample_users) {
    const user = await UserUtils.create_new_user(u.first_name, u.middle_name, u.last_name, u.password)
    add_data_to_user(user._id);
  }

}


function add_data_to_user(userId) {
  for (let i = 0; i < 10; i++) {
    const {user_id, check_in_date, mood, selected_prompt, journal_entry} = generate_daily_checkin(userId);
    Database.createDailyCheckin(user_id, check_in_date, mood, selected_prompt, journal_entry);
  }
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


