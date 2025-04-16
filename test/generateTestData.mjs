import userModel from '../models/user.mjs';

const test_users = [
  {
    user_id: 'test_user1',
    password: 'test_password1'
  },
  {
    user_id: 'test_user2',
    password: 'test_password2'
  }
];

export default async function add_test_data() {
  console.log('add_test_data() called');
  
  // Add Users
  for (let i = 0; i < test_users.length; i++) {
    let user = test_users[i];
    await add_user(user.user_id, user.password);
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