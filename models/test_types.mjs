import mongoose from 'mongoose'

// schema that points to all the different types of tests
var test_types_schema = new mongoose.Schema({
  user_id: mongoose.SchemaTypes.ObjectId,
  depression: mongoose.SchemaTypes.ObjectId,
  anxiety: mongoose.SchemaTypes.ObjectId
  // TODO: Add more tests
});

var test_types_model = mongoose.model('test_types',test_types_schema);

export default test_types_model;