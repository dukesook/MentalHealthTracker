import mongoose from 'mongoose'

// schema that points to all the user's tests
var scores_schema = new mongoose.Schema({
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
    Q10: Number,
    Q11: Number,
    Q12: Number,
    Q13: Number,
    Q14: Number,
    Q15: Number,
    Q16: Number,
    Q17: Number,
    Q18: Number,
    inattention_total: Number,
    hyperactivity_total: Number,
    total: Number
    // TODO: Add more tets
});

var scores_model = mongoose.model('scores',scores_schema);

export default scores_model;