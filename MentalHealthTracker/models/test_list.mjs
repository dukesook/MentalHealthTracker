import mongoose from 'mongoose'

// schema for generic list, the list will holds the score schema for different tests
var test_list_schema = new mongoose.Schema({
    list:[{date:Date,test_results_id:mongoose.SchemaTypes.ObjectId}]
});

var test_list_model = mongoose.model('test_list',test_list_schema);

export default test_list_model;