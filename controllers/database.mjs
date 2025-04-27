import test_types_model from '../models/test_types.mjs';
import test_list_model from '../models/test_list.mjs';
import questions_model from '../models/questions.mjs';
import dailyCheckinModel from '../models/daily_checkin.mjs';
import userModel from '../models/user.mjs';
import scores_model from '../models/scores.mjs';

export const collectionNames = [
  'dailycheckins',
  'test_lists',
  'test_questions',
  'test_types',
  'users',
  // 'scores'
]

export async function getCollection(collectionName, userId = null) {
  const model = getModel(collectionName);
  try {
    const query = userId ? { user_id: userId } : {};  // <-- build query based on userId
    const collection = await model.find(query);
    return collection;
  } catch (error) {
    console.error("Error fetching collection:", error);
  }
}

// This function makes sure the base document exist so that
// the evaluations can run
export async function create_base_collections() {
  // collection will only be created if it doesn't already exist
  questions_model.createCollection();
  // make sure the questions exist only once in the collection
  var count = await questions_model.countDocuments();
  if( count === 0 ) {
    var dep_model = new questions_model();
    dep_model.save();
  }
}

export function getAvailableTests() {
  var test_list = Object.keys(test_types_model.schema.paths)
  .filter(key=> key !== '_id' && key !== '__v' && key !== 'user_id');
  return test_list;
}

export function getModel(collectionName) {
  switch (collectionName) {
    case 'dailycheckins':
      return dailyCheckinModel;
    case 'test_lists':
      return test_list_model;
    case 'test_questions':
      return questions_model;
    case 'test_types':
      return test_types_model;
    case 'users':
      return userModel;
    default:
      throw new Error("Invalid collection name: " + collectionName);
  }
}

// function 'get_all_tests' returns the following format. 
// In this example we looked for all 'depression' tests. 
// It returened a map, where the keys are the _id for the 
// scores for each test. The value is another map with the 
// date, user_id, and the results for the questions answered.
//
// {
//   '6806edccfffab1e8c74dd2cc': {
//     _id: new ObjectId('6806edccfffab1e8c74dd2cc'),
//     user_id: new ObjectId('6806ecf0fffab1e8c74dd2b9'),
//     date: 2025-04-22T01:15:56.000Z,
//     Q1: 0,
//     total: 0,
//     __v: 0
//   },
//   '6806ee2dfffab1e8c74dd2d5': {
//     _id: new ObjectId('6806ee2dfffab1e8c74dd2d5'),
//     user_id: new ObjectId('6806ecf0fffab1e8c74dd2b9'),
//     date: 2025-04-22T01:17:33.000Z,
//     Q2: 0,
//     Q3: 0,
//     total: 0,
//     __v: 0
//   }
// }

export async function get_all_tests(user_id, test_name){
  // find the user
  const user_model = await userModel.findById(user_id);
  // find the test types link for that user

  // get test types
  const test_types = await test_types_model.findById(user_model.tests);

  // find the list link for that particular test type
  const test_list = await test_list_model.findById(test_types[test_name]);

  // dictionary to be retured, key will be the test id
  var all_scoresheets = {}
  for(const scoresheet of test_list.list){
    // find each score sheet
    var score = await scores_model.findById(scoresheet.test_results_id)
    // append the score to the score's Map
    all_scoresheets[score._id] =  score;
  }

  return all_scoresheets
}

export async function clear_database() {
  // Clear all collections in the database
  await dailyCheckinModel.deleteMany({});
  await test_list_model.deleteMany({});
  // await questions_model.deleteMany({});
  await test_types_model.deleteMany({});
  await userModel.deleteMany({});
  await scores_model.deleteMany({});
  console.log("All collections cleared.");
}

export async function createDailyCheckin(user_id, date, mood, journal) {
  const checkin = new dailyCheckinModel({
    user_id: user_id,
    check_in_date: date,
    mood,
    journal
  });

  await checkin.save();
}