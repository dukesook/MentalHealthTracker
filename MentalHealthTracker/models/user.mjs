import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_id: String,
  first_name: String,
  last_name: String,
  middle_name: String,
  password: String,
  tests: mongoose.SchemaTypes.ObjectId
  
});

userSchema.methods.listAll = function(){
  return this.model('User').find({})
}

userSchema.methods.get_first_name = function(){
  return this.model('User').first_name;
}

const modelName = 'User';
const userModel = mongoose.model(modelName, userSchema);

export default userModel;