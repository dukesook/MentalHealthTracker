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
  "user_id": "String",
  "password": "String"
}
```
### Collection #2: depressiontests
```json
{
  "user_id": "String",
  "date_taken": "Date",
  "Q1": "Number",
  "Q2": "Number",
  "Q3": "Number",
  "Q5": "Number",
  "Q6": "Number",
  "Q7": "Number",
  "Q8": "Number",
  "Q9": "Number",
}
```

### Collection #3: anxietytests
```json
{
  "user_id": "String",
  "date_taken": "Date",
  "Q1": "Number",
  "Q2": "Number",
  "Q3": "Number",
  "Q5": "Number",
  "Q6": "Number",
  "Q7": "Number",
}
```
### Collection #4: testscores
```json
{
  "user_id": "String",
  "depression": "Number",
  "anxiety": "Number",
  "other": "Number",
}
```


### Collection #5: dailycheckins
```json
{
  "user_id": "String",
  "check_in_date": "Date",
  "mood": "String",
  "journal": "String",
}
```