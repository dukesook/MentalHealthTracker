// imports
import express from 'express';
import mongoose from 'mongoose';
<<<<<<< HEAD
import userModel from './models/user.mjs';
import testsModel from './models/tests.mjs'
import add_test_data from './test/generateTestData.mjs';
import depressionModel from './models/depression_test.mjs';

=======
// model imports
import add_test_data from './test/generateTestData.mjs';
import test_types_model from './models/test_types.mjs';
import questions_model from './models/questions.mjs';
// script imports
import { run_test } from './controllers/testHandler.js';
import { create_new_user, get_current_user } from './utils/userUtils.js';
>>>>>>> 104392a1b25a1c0f41d733cc4368c05dd6d13931

const app = express();
const PORT = 3000;
const databaseUri = 'mongodb://localhost:27017/mentalHealthTracker';

var DEBUG = true;

async function main() {
  await mongoose.connect(databaseUri);
<<<<<<< HEAD
  // create tests
  var user = new userModel()
  var t = user.listAll()

=======
  // currently creating a new user every time until we get login working
  var user = create_new_user("john","bob","Smith","passW0rddd..."); 
}

// This function makes sure the base document exist so that
// the evaluations can run
async function create_base_collections(){
  // collection will only be created if it doesn't already exist
  questions_model.createCollection();
  // make sure the questions exist only once in the collection
  var count = await questions_model.countDocuments();
  if( count === 0 ){
    var dep_model = new questions_model();
    dep_model.save();
  }
>>>>>>> 104392a1b25a1c0f41d733cc4368c05dd6d13931
}


main().then(function() {
  if(DEBUG) {console.log("Mongoose connected!");}
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
<<<<<<< HEAD
  var t_model = new testsModel()
  var d_testmodel = new depressionModel()
  //var testsList = tModel.listAllTests()
  var test_list = t_model.list_all()
  console.log("TEST LIST:",test_list)
=======
  // get the tests available
  var test_list = Object.keys(test_types_model.schema.paths)
  .filter(key=> key !== '_id' && key !== '__v' && key !== 'user_id');
  if(DEBUG){console.log("TESTS AVAILABLE: "+test_list + " " + typeof(test_list));}
  // render test selection page
>>>>>>> 104392a1b25a1c0f41d733cc4368c05dd6d13931
  res.render("pages/evaluation",{test_list:test_list});
})

app.post("/evaluation", async function(req, res) {
  // check that quesitions document exists
  try{
    var questions = await questions_model.findOne();
    if(!questions){
      console.log("No questions are found");
      return res.status(404).send("Test was not found");
    }
  // get questions for the selected test
  var selected_questions = questions[req.body.selected_test];
  if(!selected_questions){
    if(DEBUG){console.log("No questions for the "+req.body.selected_test + " test");}
    return res.status(404).send("The questions were not found");
  }
  // render the test questions
  if(DEBUG){console.log("QUESTIONS: "+selected_questions);}
  res.render('pages/take_a_test',{questions:selected_questions,selected_test:req.body.selected_test})
}catch(error){
  console.log("ERROR: "+error)
  return res.status(404).send("There was an error getting the test",error);
}
});


app.post('/submit_test',async function(req,res){
  // determine which test it is and run the appropriate function
  const test = req.body.selected_test;
  if (test === 'depression' || test === 'anxiety') {
    await run_test(get_current_user(), req.body, res, test);
  } else {
    res.status(400).send("Unknown test type");
  }
});

 
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
