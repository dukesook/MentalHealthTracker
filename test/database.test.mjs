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

test('clear_database()', async() => {
  const spy = vi.spyOn(Database, 'clear_database')

});

function getMock_dailyCheckin() {
  return {
    default: vi.fn(() => ({
      save: vi.fn().mockResolvedValue()
    }))
  };
}


describe('createDailyCheckin()', async() => {
  it('should create a daily checkin', async() => {

    vi.mock('../models/daily_checkin.mjs', getMock_dailyCheckin);

    const fakeUserId = new mongoose.Types.ObjectId();
    await Database.createDailyCheckin(fakeUserId, new Date(), 'mood', 'journal');
    expect(dailyCheckinModel).toHaveBeenCalledWith(
    {
      user_id: fakeUserId,
      check_in_date: expect.any(Date),
      mood: 'mood',
      journal: 'journal'
    });
  });
});

/*
vi.mock()
  - "When you import this module, replace it with this fake version."
  - Argument #1 - The path to the module to be mocked
  - Argument #2 - A Function that returns an object to replace the module
  - Returns - 
*/