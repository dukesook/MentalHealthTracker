import mongoose from 'mongoose'

// schema used for holding questions for each test type
// each test type must have a key designated as its name so it can be pulled
var questions_schema = new mongoose.Schema({
    'depression':{
        '1': {
            question:{
                type:String,
                default:'Little interest or pleasure in doing things'
            },
            options: {
                type: [String],
                default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
              },
            },
        '2': {
            question:{
            type:String,
            default:'Feeling down, dpressed, or hopeless'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
        '3': {question:{
            type:String,
            default:'Trouble falling or staying asleep, or sleeping too much'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
        '4': {question:{
            type:String,
            default:'Feeling tired or having little energy'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
        '5': {question:{
            type:String,
            default:'Poor appetite or overeating'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
        '6': {question:{
            type:String,
            default:'Feeling bad about yourself - or that you are a failure or have let yourself or your family down'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
        '7': {question:{
            type:String,
            default:'Feeling bad about yourself - or that you are a failure or have let yourself or your family down'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
        '8': {question:{
            type:String,
            default:'Moving or speaking so slowly that other people could have noticed Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
        '9': {question:{
            type:String,
            default:'Thoughts that you would be better off dead, or of hurting yourself'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
    },

    'anxiety':{
        '1': {
            question:{
                type:String,
                default:'Feeling nervous, anxious, or on edge'
            },
            options: {
                type: [String],
                default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
              },
            },
        '2': {
            question:{
            type:String,
            default:'Not being able to stop or control worrying'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
        '3': {question:{
            type:String,
            default:'Worrying too much about different things'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
        '4': {question:{
            type:String,
            default:'Trouble relaxing'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
        '5': {question:{
            type:String,
            default:'Being so restless that it is hard to sit still'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
        '6': {question:{
            type:String,
            default:'Becoming easily annoyed or irritable'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          },
        },
        '7': {question:{
            type:String,
            default:'Feeling afraid, as if something awful might happen'
        },
        options: {
            type: [String],
            default: ['Not at all', 'Several days', 'More than half the days', 'Nearly every day']
          }
        }
    }
   
});

var questions_model = mongoose.model('test_questions',questions_schema);

export default questions_model;