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

// testsSchema.methods.list_all = function(){
//     return this.model('tests').find({});
// };


// testsSchema.methods.query = function(test_name){
//   return this.model('tests').find({test_name})  
// };

var depression_scores_model = mongoose.model('scores',depression_scores_schema);

export default depression_scores_model;