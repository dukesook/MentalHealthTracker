import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user_id: String,
  password: String
});

const modelName = 'User';  // Default Collection name = users (plural, lowercase, no underscores)
const userModel = mongoose.model(modelName, userSchema);

export default userModel;