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

<<<<<<< HEAD
=======
userSchema.methods.get_first_name = function(){
  return this.model('User').first_name;
}

>>>>>>> 104392a1b25a1c0f41d733cc4368c05dd6d13931
const modelName = 'User';
const userModel = mongoose.model(modelName, userSchema);

export default userModel;