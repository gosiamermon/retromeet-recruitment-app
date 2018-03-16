import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Typography } from 'material-ui';
import PlaylistAdd from 'material-ui-icons/PlaylistAdd';
import { Droppable } from 'react-beautiful-dnd';
import * as _ from 'lodash';
import Card from '../../containers/Retro/Card';
import { QUERY_ERROR_KEY, queryFailed, QueryShape } from '../../services/websocket/query';

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

  onDrop = (e) => {
    e.preventDefault();
    var cardId = e.dataTransfer.getData("text");
    const { column: { id }, editCard } = this.props;
    const { socket } = this.context;
    //editCard(socket, {id: cardId, columnId: id});
  };

  render() {
    const { column, classes,cards } = this.props;
    return (
      <div id={column.id} className={classes.column}
        onDragOver={(e)=>{ this.allowDrop(e); }}
        onDrop={(e) => {this.onDrop(e); }}
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
        {cards.filter(card => column.id === card.columnId).map((card, index) => (
          <Card index={index} card={card} key={card.id} />
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
