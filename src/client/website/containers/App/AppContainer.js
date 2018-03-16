import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { MuiThemeProvider, withStyles } from 'material-ui/styles';
import WebsocketProvider from '../../services/websocket/provider';
import App from './App';
import MainContent from '../Routes/MainContent';
import styles from '../../components/App/App.styles';
import theme from '../../theme';
import { socketActions } from '../../actions/socket';
import HeaderContent from '../Routes/HeaderContent';
import ConnectingDialog from '../ConnectingDialog';
import ChangeNameDialog from '../ChangeNameDialog';
import Notifications from '../../containers/Notifications';
import LocaleProvider from '../../i18n/LocaleProvider';

export class AppContainer extends Component{


  render(){
    const {store, ...rest} = this.props
    return(
      <Provider store={store}>
        <WebsocketProvider socketActions={socketActions}>
          <MuiThemeProvider theme={theme}>
            <LocaleProvider>
                <App
                  headerChildren={<HeaderContent />}
                  {...rest}
                  dialogChildren={[
                    <ConnectingDialog key="connectingDialog" />,
                    <ChangeNameDialog key="changeNameDialog" />,
                    <Notifications key="notifications" />
                  ]}
                >
                  <MainContent />
                </App>
            </LocaleProvider>
          </MuiThemeProvider>
        </WebsocketProvider>
      </Provider>
    );
  }

}
  
const mapStateToProps = state => ({
  isChangeNameDialogOpen: state.layout.isChangeNameDialogOpen,
  isConnected: state.user.connected
});

AppContainer.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  store: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(AppContainer)

