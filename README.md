# MentalHealthTracker
The Mental Health Tracker is our final project for NMSU's CS 382/532 Mondern Web Technologies class. Like a journal, users can periodically enter their mood, goals, and other factors related to mental health. The application will display how these things have progressed over time.

## Team Members
1. Devon Sookhoo
2. Brittany Benedict
3. Luis Espinoza
4. Edgar Ochoa
5. Desiree Gutierrez

## Setup

### Install Dependencies
Remember to run `$ npm install` to install all dependencies.

### Create .env file
The .env file is used to autheticate the user to use the OpenRouter API.
For security reasons, do not share or track your .env file with git.
1. create an account on https://openrouter.ai/settings/keys
2. Click on your profile, and then keys
3. Hit "Create Key"
4. Create a .env file in the root of the project directory
5. Add the following line to the .env file: `OPENROUTER_API_KEY=<Your API Key>`

### Run Server
While in the project root directory, run `$ node index.js`

### Sample Data
With the server running, go to the following url to populate the mentalHealthTracker
Database with sample data:
[http://localhost:3000/add_test_data](http://localhost:3000/add_test_data)