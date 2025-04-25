// utils/userUtils.js
import userModel from '../models/user.mjs';
import test_list_model from '../models/test_list.mjs';
import test_types_model from '../models/test_types.mjs';
import scores_model from '../models/scores.mjs';

// TODO: remove, shouldn't be hardcoded but is at this time for testing
let curr_user_id = 0; 

export function get_current_user_id() {
    // TODO: Update so that user id can be pulled from login
  return curr_user_id; // hard coded until we get a login
}

export function set_current_user_id(user_model) {
  curr_user_id = user_model._id;
}

export async function get_or_create_user() {
  const allUsers = await get_all_users();
  
  if (allUsers.length === 0) {
    const user = await create_new_user("john","bob","Smith","passW0rddd...");
    return user;
  } else {
    const user = allUsers[0]; // return the first user found
    return user;
  }
}

// connects a score document to the correct test type and user id
export async function add_scoresheet(user_id, test_name, score_doc) {
  // find the user
  const user_model = await userModel.findById(user_id);
  // find the test types link for that user
  const test_types = await test_types_model.findById(user_model.tests);
  // find the list link for that particular test type
  const test_list = await test_list_model.findById(test_types[test_name]);

  // add the score document id to the list of tests, thus linking them
  test_list.list.push({
    date: new Date(),
    test_results_id: score_doc._id
  });
  // don't forget to save the test list to update it
  await test_list.save();
}

// create a new user, also creates the necessary database scaffolding/base collections
export async function create_new_user(first_name, middle_name, last_name, password) {
    // user model
    const user_model = new userModel({
        first_name,
        middle_name,
        last_name,
        password
    });
    // create test types and link it to the user
    const test_types = new test_types_model({ user_id: user_model._id });
    user_model.tests = test_types._id;

    // create depresion tests list and link it to the test types collection
    const dep_list = new test_list_model();
    test_types.depression = dep_list._id;
    await dep_list.save();

    // create the anxiety list and link it to the test types collection
    const anx_list = new test_list_model();
    test_types.anxiety = anx_list._id;
    await anx_list.save();

    // save test types to update it
    await test_types.save();

    // save user model
    await user_model.save();
   
    return user_model;
}

export async function get_all_users() {
  const users = await userModel.find({});
  return users;
}

