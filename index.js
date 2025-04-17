import express from 'express';
import mongoose from 'mongoose';
import userModel from './models/user.mjs';
import testsModel from './models/tests.mjs'
import add_test_data from './test/generateTestData.mjs';
import depressionModel from './models/depression_test.mjs';


const app = express();
const PORT = 3000;
const databaseUri = 'mongodb://localhost:27017/mentalHealthTracker';


async function main() {
  await mongoose.connect(databaseUri);
  // create tests
  var user = new userModel()
  var t = user.listAll()

}


main().then(function() {
  console.log("Mongoose connected!");
}).catch(err => console.log(err));


app.set("view engine", "ejs"); // Use EJS as the template engine
app.use(express.json());
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
  var t_model = new testsModel()
  var d_testmodel = new depressionModel()
  //var testsList = tModel.listAllTests()
  var test_list = t_model.list_all()
  console.log("TEST LIST:",test_list)
  res.render("pages/evaluation",{test_list:test_list});
})


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