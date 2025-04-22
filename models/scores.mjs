import mongoose from 'mongoose'

// schema that points to all the user's tests
var depression_scores_schema = new mongoose.Schema({
    user_id: mongoose.SchemaTypes.ObjectId,
    date: Date,
    Q1: Number,
    Q2: Number,
    Q3: Number,
    Q4: Number,
    Q5: Number,
    Q6: Number,
    Q7: Number,
    Q8: Number,
    Q9: Number,
    total: Number
    // TODO: Add more tets
});

var scores_model = mongoose.model('scores',depression_scores_schema);

export default scores_model;