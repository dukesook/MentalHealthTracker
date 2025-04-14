import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;


app.set("view engine", "ejs"); // Use EJS as the template engine
app.use(express.json());


app.get("/", function(req, res) {
  let loggedIn = true;

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
  console.log("checkin")
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


// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});