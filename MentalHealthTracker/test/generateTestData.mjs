import userModel from '../models/user.mjs';
import anxietyTestModel from '../models/anxiety_test.mjs';
import depressionTestModel from '../models/depression_test.mjs';
import testScoreModel from '../models/test_score.mjs';
import dailyCheckinModel from '../models/daily_checkin.mjs';


export default async function add_test_data() {
  add_data(userModel, sample_users);
  add_data(depressionTestModel, sample_depression_tests);
  add_data(anxietyTestModel, sample_anxiety_tests);
  add_data(testScoreModel, sample_test_scores);
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

const sample_depression_tests = [
  {
    user_id: 'test_user1',
    date_taken: new Date('2023-01-01'),
    Q1: 2,
    Q2: 3,
    Q3: 4,
    Q4: 5,
    Q5: 1,
    Q6: 2,
    Q7: 3,
    Q8: 4,
    Q9: 5
  },
  {
    user_id: 'test_user2',
    date_taken: new Date('2023-02-01'),
    Q1: 1,
    Q2: 2,
    Q3: 3,
    Q4: 4,
    Q5: 5,
    Q6: 1,
    Q7: 2,
    Q8: 3,
    Q9: 4
  }
]

const sample_anxiety_tests = [
  {
    user_id: 'test_user1',
    date_taken: new Date('2023-01-01'),
    Q1: 2,
    Q2: 3,
    Q3: 4,
    Q4: 5,
    Q5: 1,
    Q6: 2,
    Q7: 3
  },
  {
    user_id: 'test_user2',
    date_taken: new Date('2023-02-01'),
    Q1: 1,
    Q2: 2,
    Q3: 3,
    Q4: 4,
    Q5: 5,
    Q6: 1,
    Q7: 2
  }
];

const sample_test_scores = [
  {
    user_id: 'test_user1',
    depression: 20,
    anxiety: 15,
    other: 10
  },
  {
    user_id: 'test_user2',
    depression: 25,
    anxiety: 20,
    other: 15
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