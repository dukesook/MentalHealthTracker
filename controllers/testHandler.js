// controllers/testHandler.js
// import scripts
import userModel from '../models/user.mjs';
import scores_model from '../models/scores.mjs';
import questions_model from '../models/questions.mjs';
import { add_scoresheet, get_current_user_id } from '../utils/userUtils.js';
import { faker } from '@faker-js/faker';

// Map holds the score values for each answer
var score_dict = {
  'yes': 1,
  'no': 0,
  'not_at_all': 0,
  'several_days': 1,
  'more_than_half_the_days': 2,
  'nearly_every_day': 3,
  'never': 0,
  'rarely': 0,
  'sometimes': 0,
  'often': 1,
  'very_often': 1
};


// messages for about your score section on the results page
const about_your_score = {
  'ptsd':'Current research suggests that the results of the PC-PTSD should be considered “positive” if a patient answers “yes” to any three items.',
  'adhd': 'Each of the 18 questions of the ASRS v1.1 has a clinical threshold. Reaching the clinical threshold on each question is worth 1 point. The first 6 questions are the strongest indicators of risk for ADHD. Therefore, your overall score is out of 6. A score of 4 or above indicates symptoms consistent with ADHD, but it is not a diagnosis. There are also two subscales: one for inattention, and another for hyperactivity/impulsivity. Your score on each of these subscales is out of 9. The subscales are for your information only and they do not indicate a diagnosis.',
  'depression': 'Each of your answers has a score of 0-3. Check your answers to see your score for each question. Adding these up provides your total score.',
  'anxiety': 'Each of your answers has a score of 0-3. Check your answers to see your score for each question. Adding these up provides your total score.',
  'bipolar':'A positive screen for bipolar disorder is determined if you answer yes to seven or more of the first 12 questions AND you also answer yes to question 13 AND you answer either "Moderate problem" or "Severe problem" for question 14'
}

// the textual result for each test, expect bipolar
function interpret_score(test, total) {
  if (test === 'depression') {
    if (total <= 4) return "Minimal depression";
    if (total <= 9) return "Mild depression";
    if (total <= 14) return "Moderate depression";
    if (total <= 19) return "Moderately severe depression";
    if (total <= 27) return "Severe depression";
  } else if (test === 'anxiety') {
    if (total <= 4) return "Minimal anxiety";
    if (total <= 9) return "Mild anxiety";
    if (total <= 14) return "Moderate anxiety";
    if (total <= 21) return "Severe anxiety";
  } else if (test === 'adhd') {
    if (total >= 4) return "Your symptoms are consistent with ADHD"
    return "Your symptoms are not consistent with ADHD"
  } else if (test === 'ptsd') {
    if (total >= 3) return "Your results indicate that you are experiencing some signs of PTSD."
    return "Your results indicate that you are experiencing none, or very few signs of PTSD."
  }
  return "ERROR: score=" + total;
}

// ptsd test 
export async function run_ptsd_test(current_user, results, res, test_name) {
  let total_score = 0; // running total for the score
  let score_copy = {}; // copy to pass to the render function
  let test_questions = new questions_model()[test_name]; // get the test questions

  // get the user so we know where to save the results
  const user_model = await userModel.findById(current_user);

  // filter keys to remove keys that are not question answers
  const keys = Object.keys(results).filter(k => k !== 'selected_test');

  // create new score document
  const score_doc = new scores_model(); 
  score_doc.user_id = user_model._id;
  score_doc.date = get_date();
  
  // iterate over keys and update scores
  keys.forEach((key) => {
    const val = score_dict[results[key]];
    total_score += val;
    score_doc[key] = val;
    score_copy[key] = val;
  });

  // add total score to score document and score Map
  score_doc.total = total_score;
  score_copy['total'] = total_score;

  await score_doc.save(); // save score document

  // connect the score document to the user's id
  await add_scoresheet(user_model._id, test_name, score_doc);

  // get the score interpretation
  const interpretation = interpret_score(test_name, total_score);

  // package results
  var info = {
    results: results,
    questions: test_questions,
    about: about_your_score[test_name],
    score_dict: score_copy,
    score_interpretation: interpretation
  }
  return info;
}

// bipolar test
export async function run_bipolar_test(current_user, results, res, test_name) {
  let total_score = 0; // running total for the score
  let score_copy = {}; // copy to pass to the render function
  let test_questions = new questions_model()[test_name];
  let screen = false; // false to indicate a negative screen, true for positive
  // a positive screen requires three criteria be met
  // 1. answer 'yes' to seven or more of the first 13 questions
  // 2. answer yes to question in section 2
  // 3. answer 'moderate' or 'serious' to section 3 question
  let first_section = false; // questions 1 - 12
  let second_section = false; // question 13
  let third_section = false; // question 14

  // get the user so we know where to save the results
  const user_model = await userModel.findById(current_user);

  // filter keys to remove keys that are not question answers
  const keys = Object.keys(results).filter(k => k !== 'selected_test');

  // create new score document
  const score_doc = new scores_model(); 
  score_doc.user_id = user_model._id;
  score_doc.date = get_date();
  
  // iterate over keys and update scores
  keys.forEach((key) => {
    let val = score_dict[results[key]];
    let clean_key = key;  // a key that is only the number String
    if (key.startsWith('Q')) clean_key = key.replace('Q','');
    // first section total tally
    if (clean_key <= 12 ){
      total_score += val;
    }
    // second section question
    if (clean_key == '13') {
      if (results[key] == 'yes') {second_section = true; }
      else {second_section = false; }
    }
    // third section
    if (clean_key == '14'){
      if (results[key] == 'moderate_problem' || results[key] == 'serious_problem') {third_section = true; }
      else {third_section = false; }
    }
    
    score_doc[key] = val;
    score_copy[key] = val;
  });
  // determine first section result
  if (total_score >= 7) {
    first_section = true
  } else {first_section = false; }

  // add total score to score document and score Map
  score_doc.total = total_score;
  score_copy['total'] = total_score;

  await score_doc.save(); // save score document

  // connect the score document to the user's id
  await add_scoresheet(user_model._id, test_name, score_doc);

  // score interpretation used to check for all 3 sections
  let score_interpretation = "";
  score_copy['bipolar_screen'] = first_section && second_section && third_section;
  if (score_copy['bipolar_screen'] == true) {
    score_interpretation = "Your results indicate that you are experiencing signs of bipolar disorder.";
  } else {score_interpretation = "Your symptoms are not consistent with bipolar disorder"; }

  // package results
  var info = {
    results: results,
    questions: test_questions,
    about: about_your_score[test_name],
    score_dict: score_copy,
    score_interpretation: score_interpretation
  }
  return info;
}

// adhd test
export async function run_adhd_test(current_user, results, res, test_name) {
  // store questions that belong to subtests
  let inattention_questions = {1:1, 2:1, 3:1, 4:1, 7:1, 8:1, 9:1, 10:1, 11:1};
  let hyperactivity_questions = {5:1, 6:1, 12:1, 13:1, 14:1, 15:1, 16:1, 17:1, 18:1};

  let total_score = 0; // running total for the score
  let inattention_total = 0; // total for innatetiontion questions 1, 2, 3, 4, 7, 8, 9, 10, 11
  let hyperactivity_total = 0; // total for hyperactivity questions 5, 6, 12, 13, 14, 15, 16, 17, 18
  let score_copy = {}; // copy to pass to the render function
  let test_questions = new questions_model()[test_name];
  
  // get the user so we know where to save the results
  const user_model = await userModel.findById(current_user);

  // filter keys to remove keys that are not question answers
  const keys = Object.keys(results).filter(k => k !== 'selected_test');

  // create new score document
  const score_doc = new scores_model(); 
  score_doc.user_id = user_model._id;
  score_doc.date = get_date();
  
  // iterate over keys and update scores
  keys.forEach((key) => {
    let val = score_dict[results[key]];
    let clean_key = key;
    if (key.startsWith('Q')) clean_key = key.replace('Q','');

    if (clean_key <= 6 ){
      total_score += val;
    }
    if (clean_key in inattention_questions) {
      inattention_total += val;
    }

    if (clean_key in hyperactivity_questions){
      hyperactivity_total += val;
    }
    
    score_doc[key] = val;
    score_copy[key] = val;
  });

  // add total score to score document and score Map
  score_doc.total = total_score;
  score_doc.inattention_total = inattention_total;
  score_doc.hyperactivity_total = hyperactivity_total;

  score_copy['total'] = total_score;
  score_copy['inattention_total'] = inattention_total;
  score_copy['hyperactivity_total'] = hyperactivity_total;

  await score_doc.save(); // save score document

  // connect the score document to the user's id
  await add_scoresheet(user_model._id, test_name, score_doc);

  // get the score interpretation
  const interpretation = interpret_score(test_name, total_score);

  // package results
  var info = {
    results: results,
    questions: test_questions,
    about: about_your_score[test_name],
    score_dict: score_copy,
    score_interpretation: interpretation
  }
  return info;
}

// anxiety test
export async function run_anxiety_test(current_user, results, res, test_name) {
  let total_score = 0; // running total for the score
  let score_copy = {}; // copy to pass to the render function
  let test_questions = new questions_model()[test_name];

  // get the user so we know where to save the results
  const user_model = await userModel.findById(current_user);

  // filter keys to remove keys that are not question answers
  const keys = Object.keys(results).filter(k => k !== 'selected_test');

  // create new score document
  const score_doc = new scores_model(); 
  score_doc.user_id = user_model._id;
  score_doc.date = get_date();
  
  // iterate over keys and update scores
  keys.forEach((key) => {
    const val = score_dict[results[key]];
    total_score += val;
    score_doc[key] = val;
    score_copy[key] = val;
  });

  // add total score to score document and score Map
  score_doc.total = total_score;
  score_copy['total'] = total_score;

  await score_doc.save(); // save score document

  // connect the score document to the user's id
  await add_scoresheet(user_model._id, test_name, score_doc);

  // get the score interpretation
  const interpretation = interpret_score(test_name, total_score);

  // package results
  var info = {
    results: results,
    questions: test_questions,
    about: about_your_score[test_name],
    score_dict: score_copy,
    score_interpretation: interpretation
  }
  return info;
}

// depression test
export async function run_depression_test(current_user, results, res, test_name) {
  let total_score = 0; // running total for the score
  let score_copy = {}; // copy to pass to the render function
  let test_questions = new questions_model()[test_name]; // get the test questions

  // depression test has an at-risk message with additional information
  // for the user if they were to score too high
  let depression_warning_path = '../partials/depression_at_risk.ejs'

  // get the user so we know where to save the results
  const user_model = await userModel.findById(current_user);

  // filter keys to remove keys that are not question answers
  const keys = Object.keys(results).filter(k => k !== 'selected_test');

  // create new score document
  const score_doc = new scores_model(); 
  score_doc.user_id = user_model._id;
  score_doc.date = get_date();
  
  // iterate over keys and update scores
  keys.forEach((key) => {
    const val = score_dict[results[key]];
    total_score += val;
    score_doc[key] = val;
    score_copy[key] = val;
  });

  // add total score to score document and score Map
  score_doc.total = total_score;
  score_copy['total'] = total_score;

  await score_doc.save(); // save score document
  // connect the score document to the user's id
  await add_scoresheet(user_model._id, test_name, score_doc);

  // get the score interpretation
  const interpretation = interpret_score(test_name, total_score);

  // depression test warning
  if (total_score >= 15) {
    score_copy['depression_warning_path'] = depression_warning_path;
  }
  
  // package results
  var info = {
    results: results,
    questions: test_questions,
    about: about_your_score[test_name],
    score_dict: score_copy,
    score_interpretation: interpretation
  }
  return info;
}

function get_date() {
  // return Date();
  return faker.date.anytime();
}