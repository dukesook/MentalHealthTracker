import mongoose from 'mongoose';

const dailyCheckinSchema = new mongoose.Schema({
  user_id: String,
  check_in_date: Date,
  mood: String,
  journal: String
});

const modelName = 'DailyCheckin'; // Collection name = dailycheckins (plural, lowercase, no underscores)
const dailyCheckinModel = mongoose.model(modelName, dailyCheckinSchema);

export default dailyCheckinModel;