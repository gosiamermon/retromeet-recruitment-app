import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card as MaterialCard,
  CardActions,
  CardContent,
  IconButton,
  Button,
  TextField,
  Typography
} from 'material-ui';
import CloseIcon from 'material-ui-icons/Close';
import Done from 'material-ui-icons/Done';
import { FormattedMessage } from 'react-intl';
import {
  QUERY_ERROR_KEY,
  queryFailed,
  QueryShape
} from '../../services/websocket/query';
import ConfirmActionDialog from '../../containers/ConfirmActionDialog';
import Votes from '../../components/Votes';
import { CARD, CONFIRM_QUESTION } from './Card';

export const GROUP = 'GROUP';

class CardsGroup extends Component {
  constructor(props) {
    super(props);
    this.addVote = this.vote.bind(this, true);
    this.removeVote = this.vote.bind(this, false);
    this.mergeCards = this.merge.bind(this);
    this.draggableData = {};
  }

  componentWillReceiveProps(nextProps) {
    const { editGroupQuery, removeGroupQuery, addMessage } = this.props;
    const { editGroupQuery: nextEditGroupQuery,
      removeGroupQuery: nextRemoveGroupQuery } = nextProps;

    if (queryFailed(editGroupQuery, nextEditGroupQuery)) {
      addMessage(nextEditGroupQuery[QUERY_ERROR_KEY]);
    }
    if (queryFailed(removeGroupQuery, nextRemoveGroupQuery)) {
      addMessage(nextRemoveGroupQuery[QUERY_ERROR_KEY]);
    }
  }

  vote(vote = true) {
    const { socket } = this.context;
    const { editGroup, cardsGroup: { id, columnId }, userId } = this.props;

    editGroup(socket, { id, addVote: vote && userId, removeVote: !vote && userId, columnId });
  }

  onDragStart = (e) => {
    const data = {
      id: e.target.id,
      type: GROUP
    }
    e.dataTransfer.setData("text", JSON.stringify(data));
    document.getElementById(e.target.id).style.cursor = "grabbing";
  };

  onDragEnd = (e) => {
    document.getElementById(e.target.id).style.cursor = "grab";
  }

  allowDrop = (e) => {
    e.preventDefault();
  };

  showModal = (e) => {
    e.preventDefault();
    this.draggableData = JSON.parse(e.dataTransfer.getData("text"));
    const { cardsGroup, showModal } = this.props;
    if(this.draggableData.type === CARD) {
      showModal(CONFIRM_QUESTION, this.mergeCards);
    }
  };

  merge = () => {
    const { cardsGroup, editGroup } = this.props;
    const { socket } = this.context;
    const cardsIds = cardsGroup.cards.map(card => card.id);
    cardsIds.push(this.draggableData.id);
    editGroup(socket, {id: cardsGroup.id, cardsIds });
  }


  removeCardFromGroup = (cardId) => {
    const { socket } = this.context;
    const { editGroup, removeGroup, cardsGroup } = this.props;
    if (cardsGroup.cards.length === 2) {
      removeGroup(socket, cardsGroup.id);
      return;
    }
    let cardsIds = cardsGroup.cards.map(card => card.id);
    const index = cardsIds.indexOf(cardId);
    cardsIds.splice(index, 1);
    editGroup(socket, {id: cardsGroup.id, cardsIds });
  };

  render() {
    const { userId, votes, userSubmmitedVotes, cardsGroup, classes, retroStep } = this.props;
    const { socket } = this.context;

    let draggable
    let style = {}
    if (retroStep === 'write'){
      draggable = 'true'
      style.cursor = 'grab'
    }
    else {
      draggable = 'false'
    }
    return (
      <div className={classes.draggableWrapper} id={cardsGroup.id} draggable={draggable}
        style={style}
        onDragOver={(e)=>{ this.allowDrop(e); }}
        onDrop={(e) => {this.showModal(e)}}
        onDragStart={(e)=>{this.onDragStart(e); }}
        onDragEnd={(e)=>{this.onDragEnd(e)}}
      >
        <MaterialCard
          className={classes.card}
        >
          {
            cardsGroup.cards.map((card, index) => (
              <div key={index}>
                <CardContent key="content">
                  <Typography align="left" className={classes.text}>
                    {card.text}
                  </Typography>
                  <CardActions key="actions" className={classes.cardActions}>
                    {card.authors.map(({ id, name }) => (
                      <Button key={id} size="small" className={classes.author}>{name}</Button>
                    ))}
                    <div className={classes.expander} />
                    <IconButton key="detach" className={classes.action} onClick={() => this.removeCardFromGroup(card.id)}>
                      <CloseIcon />
                    </IconButton>
                  </CardActions>
              </CardContent>
              </div>
            ))
          }          
        {retroStep === 'vote' &&
          <Votes
            key="votes"
            disabled={votes - userSubmmitedVotes <= 0}
            totalVotesNr={cardsGroup.votes.length}
            userVotesNr={cardsGroup.votes.filter(v => v === userId).length}
            addUserVote={this.addVote}
            removeUserVote={this.removeVote}
          />}
        </MaterialCard>
      </div>         
    );
  }
}

CardsGroup.contextTypes = {
  socket: PropTypes.object.isRequired
};

CardsGroup.propTypes = {
  // Values
  userId: PropTypes.string.isRequired,
  userSubmmitedVotes: PropTypes.number.isRequired,
  votes: PropTypes.number.isRequired,
  retroStep: PropTypes.string.isRequired,
  cardsGroup: PropTypes.shape({
    id: PropTypes.string.isRequired,
    cards: PropTypes.array.isRequired,
  }).isRequired,
  // Functions
  editGroup: PropTypes.func.isRequired,
  removeGroup: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  // Queries
  removeGroupQuery: PropTypes.shape(QueryShape).isRequired,
  editGroupQuery: PropTypes.shape(QueryShape).isRequired,
  // Styles
  classes: PropTypes.shape({
    card: PropTypes.string.isRequired,
    text: PropTypes.string,
    expander: PropTypes.string,
    author: PropTypes.string
  }).isRequired
};

export default CardsGroup;
