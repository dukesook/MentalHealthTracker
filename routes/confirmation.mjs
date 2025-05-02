import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import * as Database from '../controllers/database.mjs';
import * as UserUtils from '../utils/userUtils.js';

dotenv.config();

const router = express.Router();
const API_KEY = process.env.OPENROUTER_API_KEY;

router.post("/submit_journal", async (req, res) => {
  try {

    const { mood, selected_prompt, journal_entry } = req.body;

    if (!mood || !journal_entry) {
      console.warn("Missing mood or journal entry.");
      return res.status(400).render("pages/checkin_confirmation", {
        feedback: "Mood or journal entry is missing.",
        activities: ["No activities available."],
        affirmation: "Please provide all required inputs.",
        mood: mood || "Unknown",
      });
    }


    const promptMessage = `The user feels ${mood} and wrote: "${journal_entry}". 
Provide a JSON response in ENGLISH with: 
- "message": feedback for the user,
- "activities": an array of 5 short, creative activity suggestions to improve their day (no numbering),
- "affirmation": a motivating affirmation,
Respond in this format:
{
  "message": "...",
  "activities": ["...", "...", "...", "...", "..."] ,
  "affirmation": "..."
}`;

    const headers = {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    };

    const payload = {
      model: "mistralai/mistral-7b-instruct:free", 
      messages: [{ role: "user", content: promptMessage }],
      max_tokens: 350, 
    };

    //ai API call
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      payload,
      { headers }
    );

    let rawContent = response.data?.choices?.[0]?.message?.content?.trim();
    if (!rawContent) { //defualt response if no respone is given
      console.error("API response is empty or invalid.");
      rawContent = JSON.stringify({
        message: "The AI is currently unavailable. Here's some general feedback to help you reflect.",
        activities: [ 
          "Take a walk outside and enjoy nature.",
          "Write down three things you're grateful for.",
          "Spend 10 minutes meditating or practicing deep breathing.",
          "Call or message a friend to catch up.",
          "Listen to your favorite music or podcast."
        ],
        affirmation: "You are doing your best, and that's enough. Keep going!"
      });
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError.message);

      try {
        rawContent = rawContent.replace(/,\s*$/, "");
        rawContent = rawContent.replace(/"([^"]*)$/, '"$1"'); 
        parsedResponse = JSON.parse(rawContent);
        console.warn("Sanitized and successfully parsed the response.");
      } catch (sanitizeError) {
        console.error("Sanitization failed:", sanitizeError.message);

        // result to default values if parsing fails
        parsedResponse = {
          message: "The AI response could not be processed. Here's some general feedback to help you reflect.",
          activities: [
            "Take a walk outside and enjoy nature.",
            "Write down three things you're grateful for.",
            "Spend 10 minutes meditating or practicing deep breathing.",
            "Call or message a friend to catch up.",
            "Listen to your favorite music or podcast."
          ],
          affirmation: "You are doing your best, and that's enough. Keep going!"
        };
      }
    }

    // Save to Database
    await Database.createDailyCheckin(
      UserUtils.get_current_user_id(),
      new Date(),
      mood,
      selected_prompt,
      journal_entry
    )

    const feedback = parsedResponse.message || "Feedback is not available.";
    const activities = parsedResponse.activities || ["No activities available."];
    const affirmation = parsedResponse.affirmation || "Stay strong and try again soon.";

    res.render("pages/checkin_confirmation", {
      feedback,
      activities,
      affirmation,
      mood,
      selected_prompt, // pass the selected_prompt to the submission page
      journal_entry // pass the journal_entry to the submission page
    });
    
  } catch (error) {
    console.error("Error submitting journal:", error.message);
    if (error.response) {
      console.error("Error Details:", JSON.stringify(error.response.data, null, 2));
    }
    res.status(500).render("pages/checkin_confirmation", {
      feedback: "The AI is currently unavailable. Here's some general feedback to help you reflect.",
      activities: [
        "Take a walk outside and enjoy nature.",
        "Write down three things you're grateful for.",
        "Spend 10 minutes meditating or practicing deep breathing.",
        "Call or message a friend to catch up.",
        "Listen to your favorite music or podcast."
      ],
      affirmation: "You are doing your best, and that's enough. Keep going!",
      mood: req.body.mood || "Unknown",
    });
  }
});

export default router;
