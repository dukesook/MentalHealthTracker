import userModel from '../models/user.mjs';
import anxietyTestModel from '../models/anxiety_test.mjs';
import depressionTestModel from '../models/depression_test.mjs';


export default async function add_test_data() {
  console.log('add_test_data() called');
  
  // Add Users
  for (let i = 0; i < sample_users.length; i++) {
    const user = sample_users[i];
    await add_document(userModel, user);
  }

  // Add Depression Tests
  for (let i = 0; i < sample_depression_tests.length; i++) {
    const test = sample_depression_tests[i];
    await add_document(depressionTestModel, test);
  }

  // Add Anxiety Tests
  for (let i = 0; i < sample_anxiety_tests.length; i++) {
    const test = sample_anxiety_tests[i];
    await add_document(anxietyTestModel, test);
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