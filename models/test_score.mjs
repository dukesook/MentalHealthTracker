import mongoose from 'mongoose';

const testScoreSchema = new mongoose.Schema({
  user_id: String,
  depression: Number,
  anxiety: Number,
  adhd: Number,
  ptsd: Number,
  other: Number
})

const modelName = 'TestScore'; // Collection name = testscores (plural, lowercase, no underscores)
const testScoreModel = mongoose.model(modelName, testScoreSchema);

export default testScoreModel;