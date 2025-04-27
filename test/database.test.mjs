import {vi, describe, it, expect, test} from 'vitest';
import * as Database from '../controllers/database.mjs';
import test_types_model from '../models/test_types.mjs';
import test_list_model from '../models/test_list.mjs';
import questions_model from '../models/questions.mjs';
import dailyCheckinModel from '../models/daily_checkin.mjs';
import userModel from '../models/user.mjs';
import scores_model from '../models/scores.mjs';
import mongoose from 'mongoose'

// expect.toBe();
// expect.toBeInstanceOf();
// expect.toBeDefined();

test('getModel()', () => {
  expect(Database.getModel('dailycheckins')).toBeDefined();
  expect(Database.getModel('dailycheckins')).toBe(dailyCheckinModel);
})

test('collectionNames[]', () => {
  expect(Database.collectionNames).toBeDefined();
  expect(Database.collectionNames).toContain('dailycheckins');
  expect(Database.collectionNames).toContain('test_lists');
  expect(Database.collectionNames).toContain('test_questions');
  expect(Database.collectionNames).toContain('test_types');
  expect(Database.collectionNames).toContain('users');
});

// test('getCollection()', async() => {
//   const result = await Database.getCollection('dailycheckins');
//   expect(Array.isArray(result)).toBe(true);
// }) 

// describe('getCollection()', () => {
//   it('should query all documents when no userId is provided', async () => {

//     // Spy on helper function
//     const spy_getModel = vi.spyOn(Database, 'getModel');

//     // Define a mock object to simulate the dailyCheckinModel
//     const mock_dailyCheckinModel = {
//       find: async function() {
//         const checkins = [
//           { check_in_date: '2023-10-01', mood: 'happy', journal: 'Had a great day!' },
//           { check_in_date: '2023-10-02', mood: 'sad', journal: 'Not so good today.' },
//           { check_in_date: '2023-10-03', mood: 'neutral', journal: 'Just another day.' }
//         ];
//         return checkins;
//       }
//     }
//     spy_getModel.mockReturnValue(mock_dailyCheckinModel);

//     const collection = await Database.getCollection('dailycheckins');
//     expect(collection).toBeDefined();
//   })
// })

test('clear_database()', async() => {
  const spy = vi.spyOn(Database, 'clear_database')

});

function getMock_dailyCheckin() {
  function mock_dailyCheckin() {
    return {
      save: vi.fn().mockResolvedValue()
    }
  }

  const mock_dailyCheckinModel = {
    default: mock_dailyCheckin
  }
  return mock_dailyCheckinModel;
}


describe('createDailyCheckin()', async() => {
  it('should create a daily checkin', () => {

    vi.mock('../models/daily_checkin.mjs', getMock_dailyCheckin);

    const fakeUserId = new mongoose.Types.ObjectId();
    Database.createDailyCheckin(fakeUserId, new Date(), 'mood', 'journal');
  });
});

/*
vi.mock()
  - Argument #1 - The path to the module to be mocked
  - Argument #2 - A Function that returns an object to replace the module
*/