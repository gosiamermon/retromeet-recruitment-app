import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './../../components/Retro/Card.styles';
import Card from '../../components/Retro/Card';
import {
  GROUP_ADD_QUERY_KEY,
  CARD_EDIT_QUERY_KEY,
  CARD_REMOVE_QUERY_KEY,
  COLUMN_EDIT_QUERY_KEY,
  RETRO_USERS_KEY,
  RETRO_STEP_KEY,
  RETRO_VOTE_LIMIT_KEY
} from '../../reducers/retro';
import { cardEdit, cardRemove } from '../../actions/card';
import { groupAdd } from '../../actions/cardsGroup'
import { showConfirmModal } from '../../actions/confirmModal';
import { USER_ID_KEY } from '../../reducers/user';
import { addMessage } from '../../actions/layout';
import { getUserSubmittedVotes } from '../../selectors/votes';

const mapStateToProps = ({ retro, user }) => ({
  userId: user[USER_ID_KEY],
  users: retro[RETRO_USERS_KEY],
  retroStep: retro[RETRO_STEP_KEY],
  editColumnQuery: retro[COLUMN_EDIT_QUERY_KEY],
  editCardQuery: retro[CARD_EDIT_QUERY_KEY],
  removeCardQuery: retro[CARD_REMOVE_QUERY_KEY],
  addGroupQuery: retro[GROUP_ADD_QUERY_KEY],
  votes: retro[RETRO_VOTE_LIMIT_KEY],
  userSubmmitedVotes: getUserSubmittedVotes({ retro, user })
});

const mapDispatchToProps = dispatch => ({
  editCard: (socket, card) => dispatch(cardEdit(socket, card)),
  removeCard: (socket, cardId) => dispatch(cardRemove(socket, cardId)),
  addGroup: (socket, columnId, cardsIds) => dispatch(groupAdd(socket, columnId, cardsIds)),
  addMessage: message => dispatch(addMessage(message)),
  showConfirmModal: (text, submitAction) => dispatch(showConfirmModal(text, submitAction))
});

export default withRouter(withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(Card)
));
