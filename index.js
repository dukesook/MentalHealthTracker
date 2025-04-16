import express from 'express';
import mongoose from 'mongoose';
import userModel from './models/user.mjs';

const app = express();
const PORT = 3000;
const databaseUri = 'mongodb://localhost:27017/mentalHealthTracker';


async function main() {
  await mongoose.connect(databaseUri);
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
  res.render("pages/evaluation");
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


app.get("/add_test_data", async function(req, res) {
  let newUser = new userModel({
    user_id: "test_user",
    password: "test_password"
  })
  newUser.save().then(() => {
    console.log("Test user added to database.");
    res.send("Test user added to database.");
  }).catch(err => {
    console.error("Error adding test user:", err);
    res.status(500).send("Error adding test user.");
  });
})

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});