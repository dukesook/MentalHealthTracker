import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const API_KEY = process.env.OPENROUTER_API_KEY;

router.post("/submit_journal", async (req, res) => {
  try {
    console.log("Incoming Request Body:", req.body);

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

    console.log(`User selected prompt: "${selected_prompt}"`);
    console.log(`User wrote journal entry: "${journal_entry}"`);

    const promptMessage = `The user feels ${mood} and wrote: "${journal_entry}". 
Provide a JSON response in ENGLISH with: 
- "message": feedback on the journal entry,
- "activities": an array of 5 short activity suggestions to improve their day,
- "affirmation": a motivating affirmation.
Respond in this format:
{
  "message": "...",
  "activities": ["...", "...", "...", "...", "..."],
  "affirmation": "..."
}`;

    const headers = {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    };

    const payload = {
      model: "mistralai/mistral-7b-instruct:free", // Updated model
      messages: [{ role: "user", content: promptMessage }],
      max_tokens: 250, // Reduced max_tokens for efficiency
    };

    console.log("Sending request to AI API...");
    console.log("Request Headers:", headers);
    console.log("Request Payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      payload,
      { headers }
    );

    console.log("Received response from AI API:", JSON.stringify(response.data, null, 2));

    let rawContent = response.data?.choices?.[0]?.message?.content?.trim();
    if (!rawContent) {
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

    console.log("Raw Response Content:", rawContent);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(rawContent);
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError.message);

      // Attempt to sanitize the response by fixing common issues
      try {
        rawContent = rawContent.replace(/,\s*$/, ""); // Remove trailing commas
        rawContent = rawContent.replace(/"([^"]*)$/, '"$1"'); // Fix unterminated strings
        parsedResponse = JSON.parse(rawContent);
        console.warn("Sanitized and successfully parsed the response.");
      } catch (sanitizeError) {
        console.error("Sanitization failed:", sanitizeError.message);

        // Fallback to default values if parsing fails
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

    const feedback = parsedResponse.message || "Feedback is not available.";
    const activities = parsedResponse.activities || ["No activities available."];
    const affirmation = parsedResponse.affirmation || "Stay strong and try again soon.";

    console.log("Extracted Feedback:", feedback);
    console.log("Extracted Activities:", activities);
    console.log("Extracted Affirmation:", affirmation);

    res.render("pages/checkin_confirmation", {
      feedback,
      activities,
      affirmation,
      mood,
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
