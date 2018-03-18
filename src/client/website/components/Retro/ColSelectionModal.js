import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Checkbox,
  Button,
  Typography
} from 'material-ui';
import deepClone from '../../services/utils/deepClone';

class ColSelectionModal extends Component {
  constructor(props) {
    super(props)
    this.columnsVisible = []
    this.state = {
      columnsVisible: []
    }
  }

  componentDidMount() {
    const { userSettings: { columnsVisible }, columns } = this.props;
    if (columnsVisible) {
      this.setState({
        columnsVisible: columnsVisible
      })
    }
    else {
      this.setState({
        columnsVisible: columns.map(c => c.id)
      })
    }
  }

  toggleColumnVisibility = (isInputChecked, columnId) => {
    const columnsVisible = deepClone(this.state.columnsVisible);
    if (isInputChecked) {
      columnsVisible.push(columnId)
      this.setState({
        columnsVisible: columnsVisible
      })
    }
    else {
      const index = columnsVisible.indexOf(columnId);
      columnsVisible.splice(index, 1);
      this.setState({
        columnsVisible: columnsVisible
      })
    }
  }

  saveColumnsSettings = () => {
    const { setUserSettings, socket, hideModal } = this.props;
    setUserSettings(socket, { columnsVisible: this.state.columnsVisible })
    hideModal()
  }

  render() {
    const { columns, modal, hideModal, classes } = this.props;
    const { columnsVisible } = this.state;
    return(
      <Dialog open={ modal.show }>
        <DialogTitle>Choose columns</DialogTitle>
        <DialogContent>
        {
          columns.map((column, index) => {
            const visible = columnsVisible.some(c => c === column.id);
            return (
              <div key={index} className={classes.row}>
              <Typography className={classes.colName} >
                <span key={index}>{column.name}</span>
              </Typography>
              <Checkbox className={classes.checkbox}
                onChange={(e, isInputChecked) => { 
                  this.toggleColumnVisibility(isInputChecked, column.id) 
                }} 
              checked={ visible }
              />
            </div>
            );
          })
        }
        </DialogContent>
        <DialogActions>
          <Button onClick={ this.saveColumnsSettings }>
            Confirm
          </Button>
          <Button onClick={ hideModal }>
            Cancel
          </Button>
        </DialogActions>
        </Dialog>
    );
  }
}

export default ColSelectionModal;