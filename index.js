import express from 'express';
import mongoose from 'mongoose';
import userModel from './models/user.mjs';
// import testsModel from './models/test_types.mjs'
import add_test_data from './test/generateTestData.mjs';
import depression_scores_model from './models/depression_scores.mjs';
import test_list_model from './models/test_list.mjs';
import test_types_model from './models/test_types.mjs';
import questions_model from './models/questions.mjs';


const app = express();
const PORT = 3000;
const databaseUri = 'mongodb://localhost:27017/mentalHealthTracker';

var curr_user_id = 0;

var score_dict = {
  'not_at_all':0,
  'several_days':1,
  'more_than_half_the_days':2,
  'nearly_every_day':3
}
async function main() {
  await mongoose.connect(databaseUri);
  // create tests
  var user = new userModel()
  var t = user.listAll()

}

async function create_base_collections(){
  // collection will only be created if it doesn't already exist
  questions_model.createCollection();
  // make sure the questions exist only once in the collection
  var count = await questions_model.countDocuments();
  if( count === 0 ){
    var dep_model = new questions_model();
    dep_model.save();
  }
}


main().then(function() {
  console.log("Mongoose connected!");
  create_base_collections();
}).catch(err => console.log(err));


app.set("view engine", "ejs"); // Use EJS as the template engine
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get("/", function(req, res) {
  let loggedIn = true; // TODO - Somehow check if user is logged in

  if (loggedIn) {
    res.render("pages/index");
  }
  else {
    res.render("pages/login");
  }
})


app.get("/evaluation", function(req, res) {
  
  // get the tests available
  var test_list = Object.keys(test_types_model.schema.paths)
  .filter(key=> key !== '_id' && key !== '__v' && key !== 'user_id');
  console.log("TESTS AVAILABLE: "+test_list + " " + typeof(test_list));
  //test_list = ["DEP","anxIETY"]
  res.render("pages/evaluation",{test_list:test_list});
})

app.post("/evaluation", async function(req, res) {
  console.log("in post evaluation")
  // pull test questions
  //var clicked_button = Object.keys(req.body)
  console.log("SELECTED TEST: "+req.body.selected_test)
  //var q_model = new questions_model();
  try{
    var questions = await questions_model.findOne();

    if(!questions){
      console.log("No questions are found");
      return res.status(404).send("Test was not found");
    }
  
  var selected_questions = questions[req.body.selected_test];

  if(!selected_questions){
    console.log("No questions for the "+req.body.selected_test + " test")
    return res.status(404).send("The questions were not found");
  }
  
  console.log("QUESTIONS: "+selected_questions)
  res.render('pages/take_a_test',{questions:selected_questions,selected_test:req.body.selected_test})
}catch(error){
  console.log("ERROR: "+error)
}
});


async function run_depression_test(current_user,results,res){
  var total_score = 0; //  total score for test
  var score_copy = {} // for passing scores to the results page
  try{
    var user_model = await userModel.findById(get_current_user())
    console.log("CURRENT USER: ",user_model.first_name)
    //console.log("POST SUBMIT"+req.body.selected_test)

    console.log("USER TESTSS:"+user_model.tests)

  }catch(error){
    console.log(error)
  }
  var keys = Object.keys(results).filter(key=> key !== 'selected_test')
 
  console.log("TOTAL: "+total_score)

  
    console.log("APPENDING DEP SCORES")
    // append depression scores
    // first create score document
    var score_doc = new depression_scores_model();
    score_doc.user_id = user_model._id;
    score_doc.date = Date();
    keys.forEach((key)=>{
      console.log("KEY FOUND: "+key+ ":"+results[key])
      console.log("KEY VALUE: "+score_dict[results[key]])
      total_score = total_score + score_dict[results[key]]
      score_doc[key] = score_dict[results[key]];
      score_copy[key] = score_dict[results[key]];
  
    })
    console.log("SCORE COPY:",score_copy)
    score_doc.total = total_score;
    score_copy['total'] = total_score;
    score_doc.save();

    add_scoresheet(user_model._id,'depression',score_doc)
  

  var score_interpretation = "";
  if(total_score >= 1 && total_score <= 4){
    score_interpretation = "Minimal depression"
  }else if( total_score <= 9){
    score_interpretation = "Mild depression"
  }else if( total_score <= 14){
    score_interpretation = "Moderate depression"
  }else if( total_score <= 19) {
    score_interpretation = "Moderately severe depression"
  }else if( total_score <= 27){
    score_interpretation = "Severe depression"
  }else{
    score_interpretaition = "ERROR: score="+total_score;
  }


  res.render('pages/results',{results:results,score_dict:score_copy,score_interpretation:score_interpretation});
 
}

async function run_anxiety_test(current_user,results,res){
  var total_score = 0; //  total score for test
  var score_copy = {} // for passing scores to the results page
  try{
    var user_model = await userModel.findById(get_current_user())
    console.log("CURRENT USER: ",user_model.first_name)
    //console.log("POST SUBMIT"+req.body.selected_test)

    console.log("USER TESTSS:"+user_model.tests)

  }catch(error){
    console.log(error)
  }
  var keys = Object.keys(results).filter(key=> key !== 'selected_test')
 
  console.log("TOTAL: "+total_score)

  
    console.log("APPENDING DEP SCORES")
    // append depression scores
    // first create score document
    var score_doc = new depression_scores_model();
    score_doc.user_id = user_model._id;
    score_doc.date = Date();
    keys.forEach((key)=>{
      console.log("KEY FOUND: "+key+ ":"+results[key])
      console.log("KEY VALUE: "+score_dict[results[key]])
      total_score = total_score + score_dict[results[key]]
      score_doc[key] = score_dict[results[key]];
      score_copy[key] = score_dict[results[key]];
  
    })
    console.log("SCORE COPY:",score_copy)
    score_doc.total = total_score;
    score_copy['total'] = total_score;
    score_doc.save();

    add_scoresheet(user_model._id,'depression',score_doc)
  

  var score_interpretation = "";
  if(total_score >= 0 && total_score <= 4){
    score_interpretation = "Minimal anxiety"
  }else if( total_score <= 9){
    score_interpretation = "Mild anxiety"
  }else if( total_score <= 14){
    score_interpretation = "Moderate anxiety"
  }else if( total_score <= 21) {
    score_interpretation = "Severe anxiety"
  }else{
    score_interpretation = "ERROR: score="+total_score;
  }


  res.render('pages/results',{results:results,score_dict:score_copy,score_interpretation:score_interpretation});
 
}
app.post('/submit_test',async function(req,res){

  console.log("SUBMIT TEST:",req.body);

  if(req.body.selected_test === 'depression'){
    run_depression_test(get_current_user(),req.body,res);
  }else if( req.body.selected_test === 'anxiety'){
    run_anxiety_test(get_current_user(),req.body,res)
  }
  
    
});

 
async function add_scoresheet(user_id,test_name,score_doc){
  var user_model = await userModel.findById(user_id).then(console.log("found user model"));
  var test_types = await test_types_model.findById(user_model.tests).then(console.log("found test types"))
  var test_list = await test_list_model.findById(test_types[test_name]).then(console.log("found test list"))
  test_list.list.push({date:new Date(),test_results_id:score_doc._id})
  test_list.save();
}


app.get("/checkin", function(req, res) {
  res.render("pages/checkin");
})


app.get("/tracker", function(req, res) {
  res.render("pages/tracker");
})


app.get("/settings", function(req, res) {
  res.render("pages/settings");
})


app.get("/login", function(req, res) {
  res.render("pages/login");
});


app.get('/add_test_data', async function(req, res) {
  try {
    await add_test_data();
    res.status(200).send('Test data added!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

var user = create_new_user("Mark","bob","Smith","123password")

async function create_new_user(first_name, middle_name, last_name, password){
  // create user
  var user_model = new userModel()
  user_model.first_name = first_name;
  user_model.last_name = last_name;
  user_model.middle_name = middle_name;
  user_model.password = password;
  
  var test_types =  new test_types_model();
  test_types.user_id = user_model._id;
  user_model.tests = test_types._id

  // add depression test list
  var dep_test_list = await new test_list_model();
  
  console.log("DEP TEST ID: "+test_types.depression)
  test_types.depression = dep_test_list._id;
  dep_test_list.save()
  

  // add anxiety test to list
  var anx_test_list = await new test_list_model();
  test_types.anxiety = anx_test_list._id;
  anx_test_list.save();

  test_types.save();
  // create list of depression tests
  // var test_list = new test_list_model();
  // user_model.tests = test_list._id;

  // get the corret depression list
  curr_user_id = user_model._id
  user_model.save().then(()=>console.log("User saved:"+user_model._id));
  console.log("User created");

  // create depression test
  //var depression_scores = new depression_scores_model()
  //depression_scores.user_id = user_model._id;
//  var dep_scores = {

//   Q1 : 3,
//   Q2 : 2,
//   Q3:3,
//   Q4 :1,
//   Q5 :3,
//   Q6 :1,
//   Q7 :2,
//   Q8 :1,
//   Q9 : 1,
//   total : 20
//  }

//  console.log("DEPSCORES Q1:" +dep_scores['Q1'])
//  console.log("DEPRESSION LIST ID: "+test_types.depression)
 //append_depression_scores_to_list(test_types.depression,user_model._id,dep_scores)
  // add dep score to list
  //depression_list.list.push(depression_scores._id)
  //depression_scores.save()
  //depression_list.save();
  return user_model;
}

// async function create_test_types(user_id){
//   var user_model = await userModel.findById(user_id);
//   console.log("IN createtesttypes "+user_model._id)
//   var test_types = await new test_types_model();
//   test_types.user_id = user_model._id;
//   user_model.tests = test_types._id

//   var test_list = new test_list_model();
//   test_types.depression = test_list._id;
//   test_list.save()
//   test_types.save();

//   return test_types;
// }

function get_current_user(){
  return curr_user_id
}