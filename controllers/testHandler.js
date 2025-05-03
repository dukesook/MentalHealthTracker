// controllers/testHandler.js
// import scripts
import userModel from '../models/user.mjs';
import scores_model from '../models/scores.mjs';
import { add_scoresheet, get_current_user } from '../utils/userUtils.js';
import questions_model from '../models/questions.mjs';

// Map holds the score values for each answer
var score_dict = {
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

// depression and anxiety tests have similar structures so they share this function
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
  }
  return "ERROR: score=" + total;
}

export async function run_ptsd_test(current_user, results, res, test_name) {
  let total_score = 0; // running total for the score
  let score_copy = {}; // copy to pass to the render function

  score_dict = {'yes':1,'no':0};
  // get the user so we know where to save the results
  const user_model = await userModel.findById(current_user);

  // filter keys to remove keys that are not question answers
  const keys = Object.keys(results).filter(k => k !== 'selected_test');

  // create new score document
  const score_doc = new scores_model(); 
  score_doc.user_id = user_model._id;
  score_doc.date = Date();
  
  // iterate over keys and update scores
  keys.forEach((key) => {
    console.log("RESULTS[key]:",results[key])
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

  // render results
  res.render('pages/results', {
    results: results,
    score_dict: score_copy,
    score_interpretation: interpretation
  });
}
export async function run_test(current_user, results, res, test_name) {
  let total_score = 0; // running total for the score
  let score_copy = {}; // copy to pass to the render function


  // get the user so we know where to save the results
  const user_model = await userModel.findById(current_user);

  // filter keys to remove keys that are not question answers
  const keys = Object.keys(results).filter(k => k !== 'selected_test');

  // create new score document
  const score_doc = new scores_model(); 
  score_doc.user_id = user_model._id;
  score_doc.date = Date();
  
  // iterate over keys and update scores
  keys.forEach((key) => {
    console.log("RESULTS[key]:",results[key])
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

  // render results
  res.render('pages/results', {
    results: results,
    score_dict: score_copy,
    score_interpretation: interpretation
  });
}

export async function run_adhd_test(current_user, results, res, test_name) {
  let inattention_questions = {1:1, 2:1, 3:1, 4:1, 7:1, 8:1, 9:1, 10:1, 11:1};
  let hyperactivity_questions = {5:1, 6:1, 12:1, 13:1, 14:1, 15:1, 16:1, 17:1, 18:1};
  let total_score = 0; // running total for the score
  let inattention_total = 0; // total for innatetiontion questions 1, 2, 3, 4, 7, 8, 9, 10, 11
  let hyperactivity_total = 0; // total for hyperactivity questions 5, 6, 12, 13, 14, 15, 16, 17, 18
  let score_copy = {}; // copy to pass to the render function
  let test_questions = new questions_model()[test_name];
  
  let answered_questions = {}; // used to hold question and answer for the results page
  console.log("TEST QUESTIONS: ",test_questions)
  // get the user so we know where to save the results
  const user_model = await userModel.findById(current_user);

  // filter keys to remove keys that are not question answers
  const keys = Object.keys(results).filter(k => k !== 'selected_test');

  // create new score document
  const score_doc = new scores_model(); 
  score_doc.user_id = user_model._id;
  score_doc.date = Date();
  
  // iterate over keys and update scores
  keys.forEach((key) => {
    let val = score_dict[results[key]];
    let clean_key = key;
    if (key.startsWith('Q')) clean_key = key.replace('Q','');
    console.log('######### clean key',clean_key)    

    if (clean_key <= 6 ){
      total_score += val;
    }
    if (clean_key in inattention_questions) {
      console.log("INNATENTION_TOTAL key: ",key)
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

  // render results
  res.render('pages/results', {
    results: results,
    score_dict: score_copy,
    score_interpretation: interpretation
  });
}
