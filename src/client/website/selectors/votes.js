
import { createSelector } from 'reselect';
import {
  RETRO_GROUPS_KEY,
  RETRO_CARDS_KEY,
  VOTES_KEY
} from '../reducers/retro';
import {
  USER_ID_KEY
} from '../reducers/user';

const getRetroCards = state => state.retro[RETRO_CARDS_KEY];
const getRetroGroups = state => state.retro[RETRO_GROUPS_KEY];

const getUserId = state => state.user[USER_ID_KEY];

export const getUserSubmittedVotes = createSelector(
  [getRetroCards, getRetroGroups, getUserId],
  (cards, groups, userId) => {
    const cardVotes = cards.reduce((sub, card) =>
    (sub + card[VOTES_KEY].filter(v => v === userId).length), 0);
    const groupVotes = groups.reduce((sub, group) =>
    (sub + group[VOTES_KEY].filter(v => v === userId).length), 0);
    return cardVotes + groupVotes;
  }
);
