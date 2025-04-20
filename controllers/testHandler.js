// controllers/testHandler.js
// import scripts
import userModel from '../models/user.mjs';
import depression_scores_model from '../models/depression_scores.mjs';
import { add_scoresheet, get_current_user } from '../utils/userUtils.js';

// Map holds the score values for each answer
const score_dict = {
  'not_at_all': 0,
  'several_days': 1,
  'more_than_half_the_days': 2,
  'nearly_every_day': 3
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
  }
  return "ERROR: score=" + total;
}

export async function run_test(current_user, results, res, test_name) {
  let total_score = 0; // running total for the score
  let score_copy = {}; // copy to pass to the render function

  // get the user so we know where to save the results
  const user_model = await userModel.findById(current_user);

  // filter keys to remove keys that are not question answers
  const keys = Object.keys(results).filter(k => k !== 'selected_test');

  // create new score document
  const score_doc = new depression_scores_model(); 
  score_doc.user_id = user_model._id;
  score_doc.date = Date();
  
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

  // render results
  res.render('pages/results', {
    results: results,
    score_dict: score_copy,
    score_interpretation: interpretation
  });
}
