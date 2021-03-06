import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Typography } from 'material-ui';
import PlaylistAdd from 'material-ui-icons/PlaylistAdd';
import * as _ from 'lodash';
import Card from '../../containers/Retro/Card';
import { CARD } from './Card';
import CardsGroup from '../../containers/Retro/CardsGroup';
import { QUERY_ERROR_KEY, queryFailed, QueryShape } from '../../services/websocket/query';
import deepClone from '../../services/utils/deepClone';

class Column extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      text: '' ,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { addCardQuery, addMessage } = this.props;
    const { addCardQuery: nextAddCardQuery } = nextProps;
    if (queryFailed(addCardQuery, nextAddCardQuery)) {
      addMessage(nextAddCardQuery[QUERY_ERROR_KEY]);
    }
  }

  addCard = () => {
    const { socket } = this.context;
    const { text } = this.state;
    const { column: { id }, addCard } = this.props;

    addCard(socket, id, text);
    this.setState({ text: '' });
  };

  handleTextChange = (e) => {
    this.setState({ text: e.target.value });
  };

  allowDrop = (e) => {
    e.preventDefault();
  };

  switchToColumn = (e) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text"));

    const { column: { id }, editGroup, editCard } = this.props;
    const { socket } = this.context;

    if (data.type === CARD) {
      editCard(socket, {id: data.id, columnId: id});
      return;
    }
    editGroup(socket, {id: data.id, columnId: id});
  };

  render() {
    const { column, classes, cards, groups } = this.props;
    return (
      <div id={column.id} className={classes.column}
        onDragOver={(e)=>{ this.allowDrop(e); }}
        onDrop={(e) => {this.switchToColumn(e); }}
      >
        <div className={classes.header}>
          <Typography
            type="headline"
            className={classes.columnTitle}
            onDoubleClick={this.startEditing}
          >{column.name}
          </Typography>
          <IconButton className={classes.addCardIcon} onClick={this.addCard}>
            <PlaylistAdd className={classes.actionIcon} />
          </IconButton>
        </div>
        {groups.filter(group => column.id === group.columnId).map(group => (
          <CardsGroup cardsGroup={group} key={group.id} />
        ))}
        {cards.filter(card => column.id === card.columnId).map(card => (
          <Card card={card} key={card.id} />
        ))}
      </div>
    );
  }
}

Column.contextTypes = {
  socket: PropTypes.object.isRequired
};

Column.propTypes = {
  // Values
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  cards: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    columnId: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  })).isRequired,
  // Functions
  addCard: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  // Queries
  addCardQuery: PropTypes.shape(QueryShape).isRequired,
  // Styles
  classes: PropTypes.shape({
    column: PropTypes.string.isRequired,
    columnTitle: PropTypes.string.isRequired,
    addCardIcon: PropTypes.string.isRequired,
    addCardContainer: PropTypes.string.isRequired
  }).isRequired
};

export default Column;
