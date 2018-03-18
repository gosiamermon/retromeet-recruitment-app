import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button
} from 'material-ui';

class ConfirmModal extends Component {

  performAction = () => {
    const { modal, hideModal } = this.props;
    modal.submitAction();
    hideModal();
  }

  render() {
    const { modal, hideModal } = this.props;
    return(
      <Dialog open={ modal.show }>
        <DialogTitle>{ modal.text }</DialogTitle>
          <DialogActions>
            <Button onClick={ this.performAction }>
                    Yes
              </Button>
              <Button onClick={ hideModal }>
                    No
            </Button>
        </DialogActions>
    </Dialog>
    );
  }
}

export default ConfirmModal;