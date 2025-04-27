import {expect, test} from 'vitest';
import * as Database from '../controllers/database.mjs';
import dailyCheckinModel from '../models/daily_checkin.mjs';

// expect.toBe();
// expect.toBeInstanceOf();
// expect.toBeDefined();

test('getModelByCollectionName()', () => {
  expect(Database.getModelByCollectionName('dailycheckins')).toBeDefined();
  expect(Database.getModelByCollectionName('dailycheckins')).toBe(dailyCheckinModel);
})

test('collectionNames[]', () => {
  expect(Database.collectionNames).toBeDefined();
  expect(Database.collectionNames).toContain('dailycheckins');
  expect(Database.collectionNames).toContain('test_lists');
  expect(Database.collectionNames).toContain('test_questions');
  expect(Database.collectionNames).toContain('test_types');
  expect(Database.collectionNames).toContain('users');
});