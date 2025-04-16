# MentalHealthTracker
The Mental Health Tracker is our final project for NMSU's CS 382/532 Mondern Web Technologies class. Like a journal, users can periodically enter their mood, goals, and other factors related to mental health. The application will display how these things have progressed over time.

## Team Members
1. Devon Sookhoo
2. Brittany Benedict
3. Luis Espinoza
4. Edgar Ochoa
5. Desiree Gutierrez

## MongoDB
The MongoDB database name is `mentalHealthTracker`.

### Collection #1: users
```json
{
  "user_id": "string",
  "password": "string"
}
```
### Collection #2: depression_tests
```json
{
  "date_taken": "date",
  "Q1": "int",
  "Q2": "int",
  "Q3": "int",
  "Q5": "int",
  "Q6": "int",
  "Q7": "int",
  "Q8": "int",
  "Q9": "int",
}
```

### Collection #3: anxiety_tests
```json
{
  "date_taken": "date",
  "Q1": "int",
  "Q2": "int",
  "Q3": "int",
  "Q5": "int",
  "Q6": "int",
  "Q7": "int",
}
```
### Collection #4: test_scores
```json
{
  "user_id": "string",
  "depression": "int",
  "anxiety": "int",
  "other": "int",
}
```


### Collection #5: daily_checkins
```json
{
  "user_id": "string",
  "check_in_date": "date",
  "mood": "string",
  "journal": "string",
}
```