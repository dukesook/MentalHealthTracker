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
    },
    'adhd':{
        '1': {
            question:{
                type:String,
                default:'How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?'
            },
            options: {
                type: [String],
                default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
              },
            },
        '2': {
            question:{
            type:String,
            default:'How often do you have difficulty getting things in order when you have to do a task that requires organization?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          },
        },
        '3': {question:{
            type:String,
            default:'How often do you have problems remembering appointments or obligations?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          },
        },
        '4': {question:{
            type:String,
            default:'When you have a task that requires a lot of thought, how often do you avoid or delay getting started?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          },
        },
        '5': {question:{
            type:String,
            default:'How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          },
        },
        '6': {question:{
            type:String,
            default:'How often do you feel overly active and compelled to do things, like you were driven by a motor?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          },
        },
        '7': {question:{
            type:String,
            default:'How often do you make careless mistakes when you have to work on a boring or difficult project?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          }
        },
        '8': {question:{
            type:String,
            default:'How often do you have difficulty keeping your attention when you are doing boring or repetitive work?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          }
        },
        '9': {question:{
            type:String,
            default:'How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          }
        },
        '10': {question:{
            type:String,
            default:'How often do you misplace or have difficulty finding things at home or at work?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          }
        },
        '11': {question:{
            type:String,
            default:'How often are you distracted by activity or noise around you?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          }
        },
        '12': {question:{
            type:String,
            default:'How often do you leave your seat in meetings or other situations in which you are expected to remain seated?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          }
        },
        '13': {question:{
            type:String,
            default:'How often do you feel restless or fidgety?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          }
        },
        '14': {question:{
            type:String,
            default:'How often do you have difficulty unwinding and relaxing when you have time to yourself?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          }
        },
        '15': {question:{
            type:String,
            default:'How often do you find yourself talking too much when you are in social situations?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          }
        },
        '16': {question:{
            type:String,
            default:'When you’re in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          }
        },
        '17': {question:{
            type:String,
            default:'How often do you have difficulty waiting your turn in situations when turn taking is required?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          }
        },
        '18': {question:{
            type:String,
            default:'How often do you interrupt others when they are busy?'
        },
        options: {
            type: [String],
            default: ['Never', 'Rarely', 'Sometimes', 'Often', 'Very often']
          }
        }
    },
    'ptsd':{
        '1': {
            question:{
                type:String,
                default:'In the past month, have you had nightmares about the event(s) or thought about the event(s) when you did not want to?'
            },
            options: {
                type: [String],
                default: ['No','Yes']
              },
            },
        '2': {
          question:{
            type:String,
            default:'In the past month, have you tried hard not to think about the event(s) or went out of your way to avoid situations that reminded you of the event(s)?'
        },
        options: {
            type: [String],
            default: ['No','Yes']
          },
        },
        '3': {
          question:{
            type:String,
            default:'In the past month, have you been constantly on guard, watchful, or easily startled?'
        },
        options: {
            type: [String],
            default: ['No','Yes']
          },
        },
        '4': { question:{
          type:String,
          default:'In the past month, have you felt numb or detached from people, activities, or your surroundings?'
      },
      options: {
          type: [String],
          default: ['No','Yes']
        },
        },
        '5': { question:{
          type:String,
          default:'In the past month, have you felt guilty or unable to stop blaming yourself or others for the event(s) or any problems the event(s) may have caused?'
       },
      options: {
          type: [String],
          default: ['No','Yes']
        }
  
    }
  }
});

var questions_model = mongoose.model('test_questions',questions_schema);

export default questions_model;