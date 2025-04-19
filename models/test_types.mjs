import mongoose from 'mongoose'
import depression_scores_model from './depression_scores.mjs';

// schema that points to all the user's tests
var test_types_schema = new mongoose.Schema({
  user_id: mongoose.SchemaTypes.ObjectId,
  depression: mongoose.SchemaTypes.ObjectId,
  anxiety: mongoose.SchemaTypes.ObjectId
    //anxty: mongoose.SchemaTypes.ObjectId
    // TODO: Add more tets
});




var test_types_model = mongoose.model('test_types',test_types_schema);

export default test_types_model;