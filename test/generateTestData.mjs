import userModel from '../models/user.mjs';
import anxietyTestModel from '../models/anxiety_test.mjs';

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

export default async function add_test_data() {
  console.log('add_test_data() called');
  
  // Add Users
  for (let i = 0; i < sample_users.length; i++) {
    const user = sample_users[i];
    await add_user(user.user_id, user.password);
  }

  // Add Anxiety Tests
  for (let i = 0; i < sample_anxiety_tests.length; i++) {
    const test = sample_anxiety_tests[i];
    await add_anxiety_test(test);
  }

}

async function add_user(user_id, password) {
  let newUser = new userModel({
    user_id: user_id,
    password: password
  });
  await newUser.save().then(() => {
    console.log("Test user added to database.");
  }).catch(err => {
    console.error("Error adding test user:", err);
    throw err;
  });
}

async function add_anxiety_test(test) {
  let newTest = new anxietyTestModel(test);
  await newTest.save().then(() => {
    console.log("Test anxiety test added to database.");
  }).catch(err => {
    console.error("Error adding test anxiety test:", err);
    throw err;
  });
}