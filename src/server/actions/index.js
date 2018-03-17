import cardActions from './card/card.actions';
import cardHandlers from './card/card.handlers';

import columnActions from './column/column.actions';
import columnHandlers from './column/column.handlers';

import retroActions from './retro/retro.actions';
import retroHandlers from './retro/retro.handlers';

import userActions from './user/user.actions';
import userHandlers from './user/user.handlers';

import stepsActions from './steps/steps.actions';
import stepsHandlers from './steps/steps.handlers';

import cardsGroupActions from './cardsGroup/cardsGroup.actions';
import cardsGroupHandlers from './cardsGroup/cardsGroup.handlers';

const handlers = {
  ...cardHandlers,
  ...columnHandlers,
  ...retroHandlers,
  ...userHandlers,
  ...stepsHandlers,
  ...cardsGroupHandlers
};

const actions = {
  ...cardActions,
  ...columnActions,
  ...retroActions,
  ...userActions,
  ...stepsActions,
  ...cardsGroupActions
};

export {
  handlers,
  actions
};
