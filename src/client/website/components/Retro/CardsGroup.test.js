import React from 'react';
import PropTypes from 'prop-types';
import configureMockStore from 'redux-mock-store';
import { expect } from 'chai';
import CardsGroup from './CardsGroup';
import enzyme from '../../services/test/enzymeWithProviders';

const mockProps = {
  classes: {
    card: 'card',
    cardActions: 'cardActions',
    expander: 'expander',
    text: 'text',
    author: 'author',
    action: 'action'
  },
  cardsGroup: {
    id: '123',
    columnId: 'c68de31406f6',
    votes: [],
    cards: [{
      id: '7592bdd00566',
      columnId: 'c68de31406f6',
      text: 'test',
      votes: [],
      authors: ['22fdcd438af4']
    },{
      id: '60537ce2fa63',
      columnId: 'c68de31406f6',
      text: 'test',
      votes: [],
      authors: ['22fdcd438af4']
    }]
  },
  userId: '22fdcd438af4',
  retroStep: 'write',
  votes: 6,
  userSubmittedVotes: 2,
  editGroupQuery: () => ({
    [QUERY_STATUS_KEY]: QUERY_STATUS_NOT_READY,
    [QUERY_ERROR_KEY]: undefined
  }),
  removeGroupQuery: () => ({
    [QUERY_STATUS_KEY]: QUERY_STATUS_NOT_READY,
    [QUERY_ERROR_KEY]: undefined
  }),
  editGroup: () => {
  },
  removeGroup: () => {
  },
  addMessage: () => {
  },
  showConfirmModal: () => {
  },
};

const mockContext = {
  socket: {}
};

const childContextTypes = {
  socket: PropTypes.object.isRequired
};

describe(`${CardsGroup.name} component`, () => {
  it('renders without crashing', () => {
    const wrapper = enzyme.mount(
        <CardsGroup  {...mockProps}>
        </CardsGroup>,
      { context: mockContext, childContextTypes }
    );
    expect(wrapper.find('MaterialCard'), 'MaterialCard').to.have.length(1);
    expect(wrapper.find('CardContent'), 'CardContent').to.have.length(2);
    expect(wrapper.find('CardActions'), 'CardActions').to.have.length(2);
  });
});
