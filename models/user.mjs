import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_id: String,
  password: String
});

const modelName = 'User';
const userModel = mongoose.model(modelName, userSchema);

export default userModel;