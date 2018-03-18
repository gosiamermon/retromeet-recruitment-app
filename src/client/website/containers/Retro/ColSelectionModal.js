import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './../../components/Retro/ColSelectionModal.styles';
import ColSelectionModal from '../../components/Retro/ColSelectionModal';
import {
  RETRO_COL_SELECTION_MODAL_KEY,
  RETRO_COLUMNS_KEY
} from '../../reducers/retro';
import {
  USER_SETTINGS_KEY
} from '../../reducers/user'
import { hideModal } from '../../actions/colSelectionModal';
import { userSetSettings } from '../../actions/user'

const mapStateToProps = ({ retro, user }) => ({
  columns: retro[RETRO_COLUMNS_KEY],
  modal: retro[RETRO_COL_SELECTION_MODAL_KEY],
  userSettings: user[USER_SETTINGS_KEY]
});

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal()),
  setUserSettings: (socket, settings) => dispatch(userSetSettings(socket, settings))
});

export default withRouter(withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(ColSelectionModal)
));
