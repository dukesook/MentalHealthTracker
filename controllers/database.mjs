import test_types_model from '../models/test_types.mjs';
import test_list_model from '../models/test_list.mjs';
import questions_model from '../models/questions.mjs';
import dailyCheckinModel from '../models/daily_checkin.mjs';
import userModel from '../models/user.mjs';

export const collectionNames = [
  'dailycheckins',
  'test_lists',
  'test_questions',
  'test_types',
  'users'
]

export async function accessCollection(collectionName) {
  let model = null;
  if (collectionName === 'dailycheckins') {
    model = dailyCheckinModel;
  } else if (collectionName === 'test_lists') {
    model = test_list_model;
  } else if (collectionName === 'test_questions') {
    model = questions_model;
  } else if (collectionName === 'test_types') {
    model = test_types_model;
  } else if (collectionName === 'users') {
    model = userModel;
  } else {
    throw new Error("Invalid collection name: " + collectionName);
  }

  try {
    const collection = await model.find({});
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