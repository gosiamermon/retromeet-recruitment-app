import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './../../components/Retro/CardsGroup.styles';
import CardsGroup from '../../components/Retro/CardsGroup';
import {
  GROUP_EDIT_QUERY_KEY,
  GROUP_REMOVE_QUERY_KEY,
  RETRO_USERS_KEY,
  RETRO_STEP_KEY,
  RETRO_VOTE_LIMIT_KEY
} from '../../reducers/retro';
import { groupEdit, groupRemove } from '../../actions/cardsGroup';
import { USER_ID_KEY } from '../../reducers/user';
import { addMessage } from '../../actions/layout';
import { getUserSubmittedVotes } from '../../selectors/votes';


const mapStateToProps = ({ retro, user }) => ({
  userId: user[USER_ID_KEY],
  retroStep: retro[RETRO_STEP_KEY],
  editGroupQuery: retro[GROUP_EDIT_QUERY_KEY],
  removeGroupQuery: retro[GROUP_REMOVE_QUERY_KEY],
  votes: retro[RETRO_VOTE_LIMIT_KEY],
  userSubmmitedVotes: getUserSubmittedVotes({ retro, user })
});

const mapDispatchToProps = dispatch => ({
  editGroup: (socket, group) => dispatch(groupEdit(socket, group)),
  removeGroup: (socket, groupId) => dispatch(groupRemove(socket, groupId)),
  addMessage: message => dispatch(addMessage(message))
});

export default withRouter(withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(CardsGroup)
));
