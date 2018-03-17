import { withStyles } from 'material-ui/styles';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styles from './../../components/Retro/Modal.styles';
import Modal from '../../components/Retro/Modal';

import {
  RETRO_MODAL_KEY
} from '../../reducers/retro';
import { hideModal } from '../../actions/modal';

const mapStateToProps = ({ retro }) => ({
  modal: retro[RETRO_MODAL_KEY]
});

const mapDispatchToProps = dispatch => ({
  hideModal: () => dispatch(hideModal())
});

export default withRouter(withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(Modal)
));
