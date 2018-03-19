import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './../../components/Retro/Column.styles';
import Column from '../../components/Retro/Column';
import { columnEdit } from '../../actions/column';
import {
  CARD_ADD_QUERY_KEY,
  COLUMN_EDIT_QUERY_KEY,
  RETRO_CARDS_KEY,
  RETRO_GROUPS_KEY
} from '../../reducers/retro';
import { cardAdd, cardEdit } from '../../actions/card';
import { groupEdit } from '../../actions/cardsGroup';
import { addMessage } from '../../actions/layout';

const mapStateToProps = ({ retro }) => ({
  editColumnQuery: retro[COLUMN_EDIT_QUERY_KEY],
  addCardQuery: retro[CARD_ADD_QUERY_KEY]
});

const mapDispatchToProps = dispatch => ({
  editColumn: (socket, column) => dispatch(columnEdit(socket, column)),
  addCard: (socket, columnId, text) => dispatch(cardAdd(socket, columnId, text)),
  editCard: (socket, card) => dispatch(cardEdit(socket, card)),
  editGroup: (socket, group) => dispatch(groupEdit(socket, group)),
  addMessage: message => dispatch(addMessage(message))
});

export default withRouter(withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(Column)
));
