import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './../../components/Retro/ConfirmModal.styles';
import ConfirmModal from '../../components/Retro/ConfirmModal';

import {
  RETRO_CONFIRM_MODAL_KEY
} from '../../reducers/retro';
import { hideModal } from '../../actions/confirmModal';

const mapStateToProps = ({ retro }) => ({
  modal: retro[RETRO_CONFIRM_MODAL_KEY]
});

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal())
});

export default withRouter(withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(ConfirmModal)
));
