import mongoose from 'mongoose';
import Retro from '../../models/retro.model';
import User from '../../models/user.model';
import { ACTION_GROUP_ADD, ACTION_GROUP_EDIT, ACTION_GROUP_REMOVE } from './cardsGroup.actions';
import { getId, getIds } from '../../utils';

export default {
  [ACTION_GROUP_ADD]: async (params, state) => {
    const { retroId, userId } = state;
    const { columnId, cardsIds } = params;
    const retro = await Retro.findById(retroId);
    if (!retro || !retro.participates(userId)) {
      throw new Error('You are not participating in a retrospective.');
    }
    const column = retro.columns.find(c => getId(c) === columnId);
    if (!column) throw new Error('Column incorrect or not selected.');

    
    cardsIds.forEach(id => {
      const cardIndex = retro.cards.findIndex(c => c.id === id);
      const card = retro.cards[cardIndex];
      card.votes = [];
    });
    await retro.save();

    const cardsGroup = {
      _id: new mongoose.Types.ObjectId(),
      columnId,
      cardsIds,
      votes: []
    };

    const updated = await Retro.findOneAndUpdate(
      { _id: retroId },
      {
        $push: {
          cardsGroups: {
            $each: [cardsGroup], $position: 0
          }
        }
      },
      { new: true }
    ).exec();
    if (!updated) {
      throw new Error('Couldn\'t add a card.');
    }

    return {
      broadcast: {
        ...cardsGroup,
        _id: undefined,
        id: getId(cardsGroup._id)
      }
    };
  },
  [ACTION_GROUP_EDIT]: async (params, state) => {
    const { retroId, userId } = state;
    const { id, cardsIds, columnId, addVote, removeVote } = params;
    const retro = await Retro.findById(retroId);
    if (!retro.participates(userId)) {
      throw new Error('You are not participating in a retrospective.');
    }
    const cardsGroupIndex = retro.cardsGroups.findIndex(cg => cg.id === id);
    const cardsGroup = retro.cardsGroups[cardsGroupIndex];

    if (addVote) cardsGroup.votes.push(addVote);
    if (removeVote) {
      const key = cardsGroup.votes.findIndex(v => v.toHexString() === removeVote);
      cardsGroup.votes.splice(key, 1);
    }
    if (columnId) cardsGroup.columnId = columnId;
    if (cardsIds) cardsGroup.cardsIds = cardsIds;
    const updatedRetro = await retro.save();

    if (!updatedRetro) {
      throw new Error('Card not updated because it doesn\'t exist or you don\'t have sufficient privileges.');
    }
    return {
      broadcast: {
        id,
        votes: getIds(cardsGroup.votes),
        columnId: cardsGroup.columnId,
        cardsIds: cardsGroup.cardsIds
      }
    };
  },
  [ACTION_GROUP_REMOVE]: async (params, state) => {
    const { retroId, userId } = state;
    const { id } = params;
    const retro = await Retro.findById(retroId);
    if (!retro.participates(userId)) {
      throw new Error('You are not participating in a retrospective.');
    }
    
    const updated = await Retro.findOneAndUpdate({
      _id: retroId,
      cardsGroups: { $elemMatch: { _id: id } }
    }, {
      $pull: { cardsGroups: { _id: id } }
    }, {
      new: true
    }).exec();

    if (!updated) {
      throw new Error('Card not removed because it doesn\'t exist or you don\'t have sufficient privileges.');
    }

    return {
      broadcast: {
        id
      }
    };
  }
}