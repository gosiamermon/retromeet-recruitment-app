import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  Tooltip,
  Typography,
  Switch,
  IconButton,
  TextField
} from 'material-ui';
import ViewColumnIcon from 'material-ui-icons/ViewColumn';
import { CircularProgress } from 'material-ui/Progress';
import {
  QUERY_ERROR_KEY,
  QUERY_STATUS_FAILURE,
  QUERY_STATUS_KEY,
  QUERY_STATUS_SUCCESS,
  queryFailed,
  QueryShape,
  querySucceeded
} from '../../services/websocket/query';
import Column from '../../containers/Retro/Column';
import Steps from '../../containers/Retro/Steps';
import { initialsOf } from '../../services/utils/initials';
import ConfirmModal from '../../containers/Retro/ConfirmModal';
import ColSelectionModal from '../../containers/Retro/ColSelectionModal';
import deepClone from '../../services/utils/deepClone';

class Retro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortColumns: false,
      searchPhrase: ''
    }
  }
  componentWillMount() {
    this.joinRetro();
  }

  componentWillReceiveProps(nextProps) {
    const { addColumnQuery, connectQuery, addMessage } = this.props;
    const { addColumnQuery: nextAddColumnQuery, connectQuery: nextConnectQuery } = nextProps;
    if (queryFailed(addColumnQuery, nextAddColumnQuery)) {
      addMessage(nextAddColumnQuery[QUERY_ERROR_KEY]);
    }
    if (querySucceeded(connectQuery, nextConnectQuery)) {
      this.joinRetro();
    }
  }

  joinRetro = () => {
    const { joinRetro, match: { params: { retroShareId } } } = this.props;
    const { socket } = this.context;
    joinRetro(socket, retroShareId);
  };

  toggleSort = (e, checked) => {
    this.setState({
      sortColumns: checked
    });
  };

  setSearchPhrase = (e) => {
    this.setState({
      searchPhrase: e.target.value
    });
  };

  selectVisibleColumns = (userSettings, columns) => {
    if (userSettings.columnsVisible) {
      columns = columns
      .filter(column => userSettings.columnsVisible
        .some(c => c === column.id));
    }
    return columns;
  };

  render() {
    const {
      classes,
      columns,
      users,
      userSettings,
      history,
      step,
      showModal,
      joinRetroQuery: {
        [QUERY_STATUS_KEY]: joinStatus,
        [QUERY_ERROR_KEY]: joinError
      }
    } = this.props;
    const { socket } = this.context;
    const { sortColumns, searchPhrase } = this.state;

    const visibleColumns = this.selectVisibleColumns(userSettings, deepClone(columns));

    const toggled = userSettings.columnsSorted !== undefined ? userSettings.columnsSorted : false;


    switch (joinStatus) {
      case QUERY_STATUS_SUCCESS:
        return (
          <div className={classes.root}>
            <Steps />
            <div className={classes.toolbar}>
              {
                step === 'vote' &&
                <div className={classes.switch} >
                <label>Sort columns by votes</label>
                <Switch onChange={this.toggleSort} />
                </div>
              }
            <IconButton className={classes.colSelectionButton} onClick={showModal}>
              <ViewColumnIcon />
            </IconButton>
            <TextField
              className={classes.searchbox}
              helperText="Input search phrase"
              onChange={this.setSearchPhrase}
            />
            </div>
            <div className={classes.columns}>
              {visibleColumns.map(column => (
                <Column searchPhrase={searchPhrase} sort={sortColumns} key={column.id} column={column} />
              ))}
            </div>
            <div className={classes.users}>
              {Object.values(users).map(({ id, name }) => (
                <Tooltip key={id} title={name} placement="left">
                  <Avatar
                    alt={name}
                    className={classes.avatar}
                  >
                    {initialsOf(name)}
                  </Avatar>
                </Tooltip>
              ))}
            </div>
            <ConfirmModal />
            <ColSelectionModal socket={ socket } />
          </div>
        );
      case QUERY_STATUS_FAILURE:
        return (
          <div className={classes.root}>
            <Card className={classes.messageCard}>
              <Typography type="headline">Error</Typography>
              <CardContent>
                <Typography>{joinError}</Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => history.goBack()}>Back</Button>
              </CardActions>
            </Card>
          </div>
        );
      default:
        return (
          <div className={classes.root}>
            <Card className={classes.messageCard}>
              <CircularProgress color="primary" />
            </Card>
          </div>
        );
    }
  }
}

Retro.contextTypes = {
  socket: PropTypes.object.isRequired
};

Retro.propTypes = {
  // Values
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      retroShareId: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  columns: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  })).isRequired,
  users: PropTypes.object.isRequired,
  // Queries
  connectQuery: PropTypes.shape(QueryShape).isRequired,
  joinRetroQuery: PropTypes.shape(QueryShape).isRequired,
  addColumnQuery: PropTypes.shape(QueryShape).isRequired,
  // Functions
  joinRetro: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  // Styles
  classes: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
    root: PropTypes.string.isRequired,
    messageCard: PropTypes.string.isRequired,
    columns: PropTypes.string.isRequired,
    users: PropTypes.string.isRequired,
    hidden: PropTypes.string.isRequired,
    switch: PropTypes.string.isRequired,
    searchbox: PropTypes.string.isRequired
  }).isRequired
};

export default Retro;
