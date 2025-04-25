// imports
import express from 'express';
import mongoose from 'mongoose';
// model imports
import test_types_model from './models/test_types.mjs';
import test_list_model from './models/test_list.mjs';
import questions_model from './models/questions.mjs';
import dailyCheckinModel from './models/daily_checkin.mjs';
import userModel from './models/user.mjs';
// script imports
import add_test_data from './test/generateTestData.mjs';
import { run_test } from './controllers/testHandler.js';
import * as UserUtils from './utils/userUtils.js';
import * as Database from './controllers/database.mjs';

const app = express();
const PORT = 3000;
const databaseUri = 'mongodb://localhost:27017/mentalHealthTracker';
const DEBUG = true;

function debug(message) {
  if (DEBUG) {
    console.log(message);
  }
}

async function main() {
  mongoose.connect(databaseUri).then(() => {
    debug("Connected to MongoDB!");
  });

  // TODO: remove this once login is working
  const user = await UserUtils.get_or_create_user();
  UserUtils.set_current_user_id(user._id);

  Database.create_base_collections();
}

main().catch(err => console.log(err));


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
  const test_list = Database.getAvailableTests();
  debug("TESTS AVAILABLE: "+test_list + " " + typeof(test_list));

  // render test selection page
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
    debug("No questions for the "+req.body.selected_test + " test");
    return res.status(404).send("The questions were not found");
  }
  // render the test questions
  debug("TEST: "+req.body.selected_test);
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
    await run_test(UserUtils.get_current_user_id(), req.body, res, test);
  } else {
    res.status(400).send("Unknown test type");
  }
});

 
app.get("/checkin", function(req, res) {
  res.render("pages/checkin");
})

app.post("/checkin", async (req, res) => {
  try {
    console.log("Form submitted:", req.body); // Debugging line to verify form data
    const { mood, journal } = req.body;
    const user = UserUtils.get_current_user_id(); // Assuming this function gets the logged-in user

    const checkin = new dailyCheckinModel({
      user_id: user._id,
      check_in_date: new Date(),
      mood,
      journal
    });

    await checkin.save();

    res.render("pages/checkin_confirmation", { 
      message: "Thanks, check back in tomorrow!", 
      mood // pass the mood to the confirmation page
    });
  } catch (error) {
    console.error("Error saving daily check-in:", error);
    res.status(500).send("An error occurred while saving your check-in.");
  }
});


app.get("/tracker", async function(req, res) {
  const collections = Database.collectionNames;
  const user_id = UserUtils.get_current_user_id();
  const depression_scores = await Database.get_all_tests(user_id,'depression')
  console.log("Depression scores: ", depression_scores);
  const anxiety_scores = await Database.get_all_tests(user_id,'anxiety')
  console.log("Anxiety scores: ", anxiety_scores);
  res.render("pages/tracker", {
    collections: collections,
    user_id: user_id
  });
})


app.get("/query/all", async function(req, res) {
  // get query string from req
  const collectionName = req.query.collection;
  Database.getCollection(collectionName).then((collection) => {
    res.json(collection);
  }).catch((error) => {
    console.error("Error fetching collection:", error);
    res.status(500).send("An error occurred while fetching collection.");
  })
})

app.get("/query", async function(req, res) {
  const query = req.query;
  console.log("Query received:", query);
  if (!query.collection) {
    
  }
  const collectionName = query.collection;
  const userId = UserUtils.get_current_user_id();
  Database.getCollection(collectionName, userId).then((collection) => {
    res.json(collection);
  });

})

app.get("/settings", function(req, res) {
  res.render("pages/settings");
})


app.get("/login", function(req, res) {
  res.render("pages/login");
});

app.get("/register", function(req, res) {
  res.render("pages/register");
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
