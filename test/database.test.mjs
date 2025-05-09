import {vi, describe, it, expect, test} from 'vitest';
import {beforeEach, beforeAll, afterEach} from 'vitest'
import * as Database from '../controllers/database.mjs';
import test_types_model from '../models/test_types.mjs';
import test_list_model from '../models/test_list.mjs';
import questions_model from '../models/questions.mjs';
import dailyCheckinModel from '../models/daily_checkin.mjs';
import userModel from '../models/user.mjs';
import scores_model from '../models/scores.mjs';
import mongoose from 'mongoose'

beforeEach(() => {
  // runs before each test
})

beforeAll(() => {
  // runs once before all tests
})

afterEach(() => {
  vi.clearAllMocks();
})


const saveMock = vi.fn().mockResolvedValue();

vi.mock('../models/daily_checkin.mjs', () => {
  return {
    default: vi.fn(() => ({
      save: saveMock
    }))
  };
});


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


describe('createDailyCheckin()', async() => {
  it('should create a daily checkin', async() => {
    const fakeUserId = new mongoose.Types.ObjectId();
    const mood = 'pissed off';
    const selected_prompt = 'bro, do you even lift?';
    await Database.createDailyCheckin(fakeUserId, new Date(), mood, selected_prompt, 'journal');
    expect(dailyCheckinModel).toHaveBeenCalledWith(
    {
      user_id: fakeUserId,
      check_in_date: expect.any(Date),
      mood: mood,
      selected_prompt: selected_prompt,
      journal_entry: 'journal'
    });

    expect(saveMock).toBeCalled();
    expect(saveMock).toBeCalledTimes(1);
    expect(saveMock).toHaveBeenCalledOnce();
  });
});










/*
vi.mock()
  - "When you import this module, replace it with this fake version."
  - Argument #1 - The path to the module to be mocked
  - Argument #2 - A Function that returns an object to replace the module
  - Returns - Nothing

vi.fn()
  - "Returns a Mock Function"
  - 

Mock Function
  - mockResolvedValue() - returns a promise
*/