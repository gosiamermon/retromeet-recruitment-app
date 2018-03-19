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
const csvToMarkdown = require('csv-to-markdown-table');
import Column from '../../containers/Retro/Column';
import Steps from '../../containers/Retro/Steps';
import { initialsOf } from '../../services/utils/initials';
import ConfirmModal from '../../containers/Retro/ConfirmModal';
import ColSelectionModal from '../../containers/Retro/ColSelectionModal';
import deepClone from '../../services/utils/deepClone';

const CONFIRM_EXPORT_QUESTION = 'Would you like to export retro data?';

class Retro extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sortColumns: false,
      searchPhrase: ''
    }
    this.visibleCards = [];
    this.visibleGroups = [];
    this.link = undefined;
    this.downloadFile = this.download.bind(this);
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

  selectVisibleColumns = () => {
    let columns = deepClone(this.props.columns);
    const { userSettings } = this.props;

    if (userSettings.columnsVisible) {
      columns = columns
      .filter(column => userSettings.columnsVisible
        .some(c => c === column.id));
    }
    return columns;
  };

  prepareFileContent = (extension) => {
    const extensionIsMd = extension === 'md';
    let columns = deepClone(this.props.columns);
    //check max rows number
    const nrOfRowsInEachCol = [];
    columns.forEach(col => {
      const cards = this.visibleCards.filter(c => c.columnId === col.id);
      const groups = this.visibleGroups.filter(g => g.columnId === col.id);
      col.cardsAndGroups = groups.concat(cards);
      nrOfRowsInEachCol.push(col.cardsAndGroups.length);
    });

    const maxNrOfRows = Math.max(...nrOfRowsInEachCol);
    //append column headers
    let fileContent = columns.map(c => `"${c.name}"`).join(',');
    fileContent += '\n';
    //append cards and groups
    for (let i=0; i<maxNrOfRows; i++) {
      let row = '';
      columns.forEach(col => {
        let text
        if (col.cardsAndGroups[i]) {
          text = col.cardsAndGroups[i].text ? col.cardsAndGroups[i].text : 
            col.cardsAndGroups[i].cards.map(c => c.text).join(';');
        }
        else {
          text = 'n/a';
        }
        row += `"${text}",`
      });
      fileContent += `${row}\n`;
    }
    //append extension
    if (extensionIsMd) {
      fileContent = csvToMarkdown(fileContent, ",", true);
    }
    fileContent = `data:text/${extension};charset=utf-8,\n${fileContent}`;
    return fileContent;
  };

  prepareDownloadData = (extension) => {
    const fileContent = this.prepareFileContent(extension);
    const encodedUri = encodeURI(fileContent);
    this.link = document.createElement("a");
    this.link.setAttribute("href", encodedUri);
    this.link.setAttribute("download", `retro.${extension}`);
    document.body.appendChild(this.link); 
  };

  confirmExport = (extension) => {
    this.prepareDownloadData(extension);
    const { showConfirmModal } = this.props;
    showConfirmModal(CONFIRM_EXPORT_QUESTION, this.downloadFile);
  };

  download = () => {
    this.link.click();
    this.link.remove();
  };

  prepareCardsAndGroups = () => {
    let cards = deepClone(this.props.cards);
    let groups = deepClone(this.props.groups);
    const { searchPhrase, sortColumns } = this.state;
    groups.forEach(group => {
      group.cards = cards.filter(card => 
        group.cardsIds.some(cardId => cardId === card.id));
    });
    const allGroupedCardsIds = [].concat.apply([], groups.map(group => group.cardsIds));
    cards = cards.filter(card => !allGroupedCardsIds.some(cardId => cardId === card.id));

    groups.forEach(group => {
      delete group.cardsIds;
    });
    if (sortColumns) {
      cards = this.sortByVotes(cards);
      groups = this.sortByVotes(groups);
    }
    this.visibleCards = cards;
    this.visibleGroups = groups;
    if (searchPhrase) {
      cards = cards.filter(c => c.text.includes(searchPhrase));
      groups = groups.filter(group => group.cards
        .some(c => c.text.includes(searchPhrase)));
    }
    return { cards, groups };
  };

  sortByVotes(items) {
    const compare = (a,b) => {
      if (a.votes.length > b.votes.length)
        return -1;
      if (a.votes.length < b.votes.length)
        return 1;
      return 0;
    }
    
    return items.sort(compare);
  }

  render() {
    const {
      classes,
      users,
      cards,
      groups,
      history,
      step,
      showColSelectionModal,
      joinRetroQuery: {
        [QUERY_STATUS_KEY]: joinStatus,
        [QUERY_ERROR_KEY]: joinError
      }
    } = this.props;
    const { socket } = this.context;
    const { sortColumns, searchPhrase } = this.state;
    const visibleColumns = this.selectVisibleColumns();
    const prepared = this.prepareCardsAndGroups();

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
              <IconButton className={classes.colSelectionButton} onClick={showColSelectionModal}>
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
                <Column cards={prepared.cards} groups={prepared.groups} key={column.id} column={column} />
              ))}
            </div>
            <div className={classes.export}>
              <Button className={classes.exportButton} 
                onClick={() => { this.confirmExport('csv') }} >
                Export to CSV
              </Button>
              <Button className={classes.exportButton} 
                onClick={() => { this.confirmExport('md') }} >
                Export to MD
              </Button>
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
    searchbox: PropTypes.string.isRequired,
    export: PropTypes.string.isRequired,
    exportButton: PropTypes.string.isRequired
  }).isRequired
};

export default Retro;
