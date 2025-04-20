import mongoose from 'mongoose';

const dailyCheckinSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  check_in_date: { type: Date, required: true },
  mood: { type: String, required: true },
  journal: { type: String, required: true }
});

const dailyCheckinModel = mongoose.model('DailyCheckin', dailyCheckinSchema);

export default dailyCheckinModel;