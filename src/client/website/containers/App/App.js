import App from '../../components/App/App';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import styles from '../../components/App/App.styles';
import { cardEdit } from '../../actions/card'

const mapDispatchToProps = dispatch => ({
  editCard: (socket, card) => dispatch(cardEdit(socket, card))
});

export default withStyles(styles)(
  connect(null, mapDispatchToProps)(App)
);
