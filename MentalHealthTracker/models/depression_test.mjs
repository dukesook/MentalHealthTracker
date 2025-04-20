import mongoose from 'mongoose'

var depressionTestSchema = new mongoose.Schema({
    1: String,
    2: String,
    3: String,
    4: String,
    5: String,
    6: String,
    7: String,
    8: String,
    9: String
});



var depressionModel = mongoose.model('depression',depressionTestSchema);

export default depressionModel;
