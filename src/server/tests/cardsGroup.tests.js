import { assert } from 'chai';
import mongoose from 'mongoose';

import connectToDatabase from '../database';
import User from '../models/user.model';
import Retro from '../models/retro.model';
import { ACTION_GROUP_ADD, ACTION_GROUP_EDIT, ACTION_GROUP_REMOVE } from '../actions/cardsGroup/cardsGroup.actions';
import handlers from '../actions/cardsGroup/cardsGroup.handlers';
import { getId, getIds } from '../utils';
import { assertError } from './test.utils';

describe('CardsGroup actions', () => {
  let testState;

  before(async () => {
    await connectToDatabase();
  });

  beforeEach(async () => {
    const scrumMaster = await new User({ name: 'Test User' }).save();
    const user = await new User({ name: 'Test User' }).save();
    const column = { _id: mongoose.Types.ObjectId(), name: 'Test Column', icon: 'action' };
    const retro = await new Retro({
      columns: [{ name: 'First', icon: 'positive' }, column, { name: 'Second', icon: 'negative' }],
      cards: [{ _id: mongoose.Types.ObjectId(), text: 'Test1', authors: [mongoose.Types.ObjectId()], votes: [], columnId: column._id },
              { _id: mongoose.Types.ObjectId(), text: 'Test2', authors: [mongoose.Types.ObjectId()], votes: [], columnId: column._id }],
      users: [{ user }, { user: scrumMaster }],
      scrumMaster
    }).save();
    testState = {
      retroId: retro.id,
      userId: user.id,
      user,
      scrumMasterId: scrumMaster.id,
      columnId: getId(column._id),
      cardId_1: getId(retro.cards[0]._id),
      cardId_2: getId(retro.cards[1]._id)
    };
  });

  afterEach(async () => {
    await Retro.remove();
  });

  describe('Create', () => {
    it('should be able to create a group in an existing column from existing cards', async () => {
      const { cardId_1, cardId_2, columnId, retroId, userId, user } = testState;
      const params = { cardsIds: [cardId_1, cardId_2], columnId };
      const state = { userId, retroId };

      const result = await handlers[ACTION_GROUP_ADD](params, state);
      const group = result.broadcast;

      // Check handler result
      assert.notEqual(group, undefined);
      assert.equal(group._id, undefined);
      assert.notEqual(group.id, undefined);
      assert.deepEqual(group.cardsIds, params.cardsIds);
      assert.equal(group.columnId, params.columnId);

      // Check value in the database
      const retro = await Retro.findById(retroId);
      assert.equal(retro.cardsGroups.length, 1);
      const databaseGroup = retro.cardsGroups[0];
      assert.equal(databaseGroup._id, group.id);
      assert.equal(databaseGroup.columnId, group.columnId);
      assert.deepEqual(getIds(databaseGroup.cardsIds), group.cardsIds);
      assert.deepEqual(getIds(databaseGroup.votes), group.votes);
    });
  });

});
