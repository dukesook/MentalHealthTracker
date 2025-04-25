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

export async function getCollection(collectionName, userId) {
  const model = getModelByCollectionName(collectionName);
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

function getModelByCollectionName(collectionName) {
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