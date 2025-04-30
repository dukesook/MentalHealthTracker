import * as UserUtils from '../utils/userUtils.js'
import {test, expect, describe, it} from 'vitest'
import mongoose from 'mongoose'

test('set_current_user_id() - Positive', () => {
  const fakeUserId = new mongoose.Types.ObjectId();

  UserUtils.set_current_user_id(fakeUserId);

  expect(UserUtils.get_current_user_id()).toBe(fakeUserId)
})

test('set_current_user_id() - Negative', () => {
  expect(() => UserUtils.set_current_user_id('string')).toThrowError();
  expect(() => UserUtils.set_current_user_id(null)).toThrowError();
  expect(() => UserUtils.set_current_user_id(undefined)).toThrowError();
  expect(() => UserUtils.set_current_user_id()).toThrowError();
  expect(() => UserUtils.set_current_user_id(42)).toThrowError();
  expect(() => UserUtils.set_current_user_id([])).toThrowError();
  expect(() => UserUtils.set_current_user_id({})).toThrowError();
})

test('get_current_user_id()', () => {
  const fakeUserId = new mongoose.Types.ObjectId();
  UserUtils.set_current_user_id(fakeUserId);
  expect(UserUtils.get_current_user_id()).toBe(fakeUserId)
})