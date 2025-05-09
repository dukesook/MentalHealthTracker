import dotenv from 'dotenv';
import express from 'express';
import axios from 'axios'; // Import axios for making HTTP requests
import add_test_data from './test/generateTestData.mjs';
import * as UserUtils from './utils/userUtils.js';
import * as Database from './controllers/database.mjs';
import confirmationRoutes from './routes/confirmation.mjs';
import * as TestHandler from './controllers/testHandler.js'

import UserModel from './models/user.mjs'

const API_KEY = process.env.OPENROUTER_API_KEY;
const app = express();
const PORT = 3000;
const DEBUG = true;
let loggedIn = false;         // Checks if user if logged in, or not.
var valid_tests = {'depression':1,'adhd':1,'anxiety':1,'ptsd':1, 'bipolar':1};

function debug(message) {
  if (DEBUG) {
    console.log(message);
  }
}

async function main() {

  // TODO: remove this once login is working
  const user = await UserUtils.get_or_create_user();
  UserUtils.set_current_user_id(user._id);

  // base collections are needed in order for app to function
  Database.create_base_collections();

  dotenv.config(); // Load the .env file
  console.log("Loaded API Key:", process.env.OPENROUTER_API_KEY);
  if (!API_KEY) {
    console.error("Error: OPENROUTER_API_KEY is not defined. Check your .env file.");
    process.exit(1); // Exit the application if the API key is missing
  }
}

main().catch(err => console.log(err));

app.set("view engine", "ejs"); // Use EJS as the template engine
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use("/", confirmationRoutes);

app.get("/", function(req, res) {
  // let loggedIn = false; // TODO - Somehow check if user is logged in
  if (loggedIn) {
    res.render("pages/index");
  }
  else {
    res.render("pages/login");
  }

  app.post('/register', async (req, res) => {
    const data = {
      first_name: req.body.first_name,
      password: req.body.password
    }
  
    const checking = await UserModel.findOne({ first_name: req.body.first_name})
    try{
      if (checking.first_name === red.body.first_name && checking.password === req.body.password){
        res.send("These user details already exist, try changing something!")
      }
      else {
        await UserModel.insertMany([data])
      }
    }
    catch {
      res.render("pages/index", {
        naming: req.body.first_name
      })
      loggedIn = true;
    }
  
    // res.render("pages/index", {
    //   naming: req.body.first_name
    // })
  })
  
  app.post('/login', async (req, res) => {
    try {
      const check = await UserModel.findOne({ first_name: req.body.first_name})
      if (check.password === req.body.password){
        res.render("pages/index", { naming: `${req.body.password}+${req.body.first_name}`})
        loggedIn = true;
      }
      else {
        res.send("The password is incorrect, check again!")
      }
    }
  
    catch (e) {
      res.send("Wrong Details!")
    }
  })

  app.post('/logout', async (req, res) => {
    loggedIn = false;
    res.render("pages/login");
  })
});


app.get("/evaluation", function(req, res) {
  // get a list of available tests to take
  const test_list = Database.getAvailableTests();

  // render test selection page
  res.render("pages/evaluation",{test_list:test_list});
});

app.post("/evaluation", async function(req, res) {
  // check that quesitions document exists
  try{
    var questions = await Database.get_questions();
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
  res.render('pages/take_a_test',{questions:selected_questions,selected_test:req.body.selected_test});
  }catch(error){
    console.log("ERROR: "+error);
    return res.status(404).send("There was an error getting the test",error);
  }
});

// for when a user submits their answers to a test
app.post('/submit_test',async function(req,res){
  // determine which test it is and run the appropriate function
  const test = req.body.selected_test;
  var info = {} // used for render results
  if (test in valid_tests) {
    if (test === 'adhd') { 
      info = await TestHandler.run_adhd_test(UserUtils.get_current_user_id(),req.body, res, test);}
    else if (test === 'ptsd') {
      info = await TestHandler.run_ptsd_test(UserUtils.get_current_user_id(),req.body, res, test);}
    else if (test === 'depression') { 
      info = await TestHandler.run_depression_test(UserUtils.get_current_user_id(), req.body, res, test); }
    else if (test === 'anxiety') { 
      info = await TestHandler.run_anxiety_test(UserUtils.get_current_user_id(), req.body, res, test); }
    else if (test === 'bipolar') { 
      info = await TestHandler.run_bipolar_test(UserUtils.get_current_user_id(), req.body, res, test); }
  } else {
    res.status(400).send("Unknown test type");
  }
  res.render('pages/results',info );
});

app.get("/checkin", async (req, res) => {
  try {
    const { mood } = req.query; 
    if (!mood) {
      return res.render("pages/checkin", { prompts: [], mood: null });
    }

    const moods = Array.isArray(mood) ? mood : [mood]; 
    const combinedMood = moods.join(" and "); 

    const prompt = `Give 5 short, one sentence long JOURNAL PROMPTS for someone feeling ${combinedMood} to write about.`;

    let prompts = [];
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct:free", // Updated model
          messages: [{ role: "user", content: prompt }],
          max_tokens: 170, // Reduced max_tokens for efficiency
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${API_KEY}`,
          },
        }
      );

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        prompts = response.data.choices[0]?.message?.content?.trim().split("\n").filter(Boolean);
        if (prompts && prompts.length > 0) {
          // Sanitize prompts to remove numbers and quotation marks
          prompts = prompts.map(prompt => prompt.replace(/^\d+\.\s*|["']/g, "").trim());
        }
      }
    } catch (apiError) {
      console.error("Error fetching prompts from API:", apiError.message);
    }

    // Use fallback prompts if API call fails or returns invalid data
    if (!prompts || prompts.length === 0) {
      console.warn("Using fallback prompts due to API failure or invalid response.");
      prompts = [
        "What made you smile today?",
        "What is one thing you are grateful for?",
        "What is something you are looking forward to?",
        "What is a challenge you overcame recently?",
        "What is one thing you love about yourself?"
      ];
    }

    res.render("pages/checkin", { prompts, mood: combinedMood });
  } catch (error) {
    console.error("Error fetching prompts:", error.message);
    res.status(500).send("An error occurred while fetching prompts.");
  }
});

app.get("/tracker", async function(req, res) {
  const user_id = UserUtils.get_current_user_id();
  res.render("pages/tracker", {
    user_id: user_id
  });
});

app.get("/query", async function(req, res) {
  // Get a collection associated with the current user
  const collectionName = req.query.collection;
  const userId = UserUtils.get_current_user_id();
  Database.getCollection(collectionName, userId).then((collection) => {
    res.json(collection);
  }).catch((error) => {
    console.error("Error fetching collection:", error);
    res.status(500).send("An error occurred while fetching collection.");
  })
});

app.get("/query/all", async function(req, res) {
  // Get the entire collection for all users (for testing purposes)
  const collectionName = req.query.collection;

  Database.getCollection(collectionName).then((collection) => {
    res.json(collection);
  }).catch((error) => {
    console.error("Error fetching collection:", error);
    res.status(500).send("An error occurred while fetching collection.");
  });
});

app.get("/query/test_scores", async function(req, res) {
  // Get all tests results for the current user
  const id = UserUtils.get_current_user_id();
  const test_scores = await Database.get_test_scores(id);
  res.json(test_scores);
})

app.get("/settings", function(req, res) {
  if (loggedIn){
    res.render("pages/settings");
  }
  else{
    res.render("pages/login");
  }
});

app.get("/login", function(req, res) {
  res.render("pages/login");
});

app.get("/register", function(req, res) {
  res.render("pages/register");
});

app.get("/anxiety", function(req, res) {
  if (loggedIn){
    res.render("pages/anxiety");
  }
  else{
    res.render("pages/login");
  }
});

app.get("/depression", function(req, res) {
  if (loggedIn){
    res.render("pages/depression");
  }
  else{
    res.render("pages/login");
  }
});

app.get("/ptsd", function(req, res) {
  if (loggedIn){
    res.render("pages/ptsd");
  }
  else{
    res.render("pages/login");
  }
});

app.get("/adhd", function(req, res) {
  if (loggedIn){
    res.render("pages/adhd");
  }
  else{
    res.render("pages/login");
  }
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

app.get('/clear_database', async function(req, res) {
  // WARNING - This will delete all data in the database!
  try {
    await Database.clear_database();
    res.status(200).send('Database cleared!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong.');
  }  
});

app.get("/test_api", async (req, res) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct:free", 
        messages: [{ role: "user", content: "Test API key with OpenRouter." }],
        max_tokens: 50,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
      }
    );

    console.log("Full OpenRouter Response:", response.data);

    const reply = response.data.choices[0].message.content;
    console.log("Generated Reply:", reply);

    res.json({ reply });
  } catch (error) {
    console.error("Error testing OpenRouter API:", error.message);
    if (error.response) {
      console.error("Error Details:", error.response.data);
    }
    res.status(500).send("An error occurred while testing the API.");
  }
});

//see the API's status
app.get("/test_key", async (req, res) => {
  try {
    const response = await axios.get("https://openrouter.ai/api/v1/auth/key", {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    });

    console.log("API Key Test Response:", response.data);
    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error testing API key:", error.message);
    if (error.response) {
      console.error("Error Details:", error.response.data);
    }
    res.status(500).json({ success: false, message: "Failed to test API key." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
