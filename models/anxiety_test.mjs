import mongoose from 'mongoose';

const anxietyTestSchema = new mongoose.Schema({
  user_id: String,
  date_taken: Date,
  Q1:  Number,
  Q2:  Number,
  Q3:  Number,
  Q4:  Number,
  Q5:  Number,
  Q6:  Number,
  Q7:  Number,
});

const modelName = 'AnxietyTest'; // Collection name = anxietytests (plural, lowercase, no underscores)
const anxietyTestModel = mongoose.model(modelName, anxietyTestSchema);

export default anxietyTestModel;