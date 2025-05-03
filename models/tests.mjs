import mongoose from 'mongoose'

var testsSchema = new mongoose.Schema({
    depression: String,
    anxiety: String,
    adhd: String,
    ptsd: String
    // TODO: Add more tets
});

testsSchema.methods.list_all = function(){
    return this.model('tests').find({});
};


testsSchema.methods.query = function(test_name){
  return this.model('tests').find({test_name})  
};

var testsModel = mongoose.model('tests',testsSchema);

export default testsModel;