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

  const fakeRes = {render: function() { } };

  for (let i = 0; i < numCheckins; i++) {
    // Checkins
    const {user_id, check_in_date, mood, selected_prompt, journal_entry} = generate_daily_checkin(userId);
    Database.createDailyCheckin(user_id, check_in_date, mood, selected_prompt, journal_entry);
    
    // ADHD
    const adhdResult = create_adhd_test_results();
    await TestHandler.run_adhd_test(userId, adhdResult, fakeRes, 'adhd');
    
    // Depression
    const depressionResult = create_depression_test_results();
    await TestHandler.run_depression_test(userId, depressionResult, fakeRes, 'depression');
    
    // PTSD Test
    const ptsdResult = create_ptsd_test_results();
    await TestHandler.run_ptsd_test(userId, ptsdResult, fakeRes, 'ptsd');
    
    // Anxiety Test
    const anxietyResult = create_anxiety_test_results();
    await TestHandler.run_anxiety_test(userId, anxietyResult, fakeRes, 'anxiety');
  }
}


function create_ptsd_test_results() {
  const answers = ['yes', 'no'];
  const results = {
    selected_test: 'ptsd',
    Q1: get_random(answers),
    Q2: get_random(answers),
    Q3: get_random(answers),
    Q4: get_random(answers),
    Q5: get_random(answers),
  }
  return results;
}

function create_adhd_test_results() {
  const answers = ['never', 'rarely', 'sometimes', 'often', 'very_often'];
  const results = {
    selected_test: 'adhd',
    Q1: get_random(answers),
    Q2: get_random(answers),
    Q3: get_random(answers),
    Q4: get_random(answers),
    Q5: get_random(answers),
    Q6: get_random(answers),
    Q7: get_random(answers),
    Q8: get_random(answers),
    Q9: get_random(answers),
    Q10: get_random(answers),
    Q11: get_random(answers),
    Q12: get_random(answers),
    Q13: get_random(answers),
    Q14: get_random(answers),
    Q15: get_random(answers),
    Q16: get_random(answers),
    Q17: get_random(answers),
    Q18: get_random(answers),
  }
  return results;
}

function create_depression_test_results() {
  const answers = ['not_at_all', 'several_days', 'more_than_half_the_days', 'nearly_every_day'];
  const results = {
    selected_test: 'depression',
    Q1: get_random(answers),
    Q2: get_random(answers),
    Q3: get_random(answers),
    Q4: get_random(answers),
    Q5: get_random(answers),
    Q6: get_random(answers),
    Q7: get_random(answers),
    Q8: get_random(answers),
    Q9: get_random(answers),
  }
  
  return results;
}

function create_anxiety_test_results() {
  const answers = ['not_at_all', 'several_days', 'more_than_half_the_days', 'nearly_every_day'];
  const results = {
    selected_test: 'anxiety',
    Q1: get_random(answers),
    Q2: get_random(answers),
    Q3: get_random(answers),
    Q4: get_random(answers),
    Q5: get_random(answers),
    Q6: get_random(answers),
    Q7: get_random(answers),
  }
  return results;
}

function get_random(list) {
  return list[Math.floor(Math.random() * list.length)];
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
  const num_sentences = faker.number.int({ min: 2, max: 20 });

  const dailyCheckin = {
    user_id: user_id,
    check_in_date: faker.date.anytime(),
    mood: randomMood,
    selected_prompt: faker.lorem.sentence(),
    journal_entry: faker.lorem.sentences(num_sentences),
  }
  return dailyCheckin;
}


