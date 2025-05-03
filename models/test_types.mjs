import mongoose from 'mongoose'

// schema that points to all the different types of tests
var test_types_schema = new mongoose.Schema({
  user_id: mongoose.SchemaTypes.ObjectId,
  depression: mongoose.SchemaTypes.ObjectId,
<<<<<<< HEAD
  anxiety: mongoose.SchemaTypes.ObjectId,
  adhd: mongoose.SchemaTypes.ObjectId,
  ptsd: mongoose.SchemaTypes.ObjectId
  // TODO: Add more tets
=======
  anxiety: mongoose.SchemaTypes.ObjectId
  // TODO: Add more tests
>>>>>>> main
});

var test_types_model = mongoose.model('test_types',test_types_schema);

export default test_types_model;