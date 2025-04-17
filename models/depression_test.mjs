import mongoose from 'mongoose';

const depressionTestSchema = new mongoose.Schema({
  user_id: String,
  date_taken: Date,
  Q1: Number,
  Q2: Number,
  Q3: Number,
  Q4: Number,
  Q5: Number,
  Q6: Number,
  Q7: Number,
  Q8: Number,
  Q9: Number,
});

const modelName = 'DepressionTest'; // Collection name = depressiontests (plural, lowercase, no underscores)
const depressionTestModel = mongoose.model(modelName, depressionTestSchema);

export default depressionTestModel;