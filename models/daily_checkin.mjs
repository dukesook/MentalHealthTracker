import mongoose from 'mongoose';

const dailyCheckinSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  check_in_date: { type: Date, required: false },
  mood: { type: String, required: true },
  selected_prompt: { type: String, required: true },
  journal_entry: { type: String, required: true }
});

const dailyCheckinModel = mongoose.model('DailyCheckin', dailyCheckinSchema);

export default dailyCheckinModel;


