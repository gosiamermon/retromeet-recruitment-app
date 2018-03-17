import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Button
} from 'material-ui';

class Modal extends Component {

  performAction(){
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
                <Button onClick={() => { this.performAction(); }}>
                        Merge
                  </Button>
                  <Button onClick={() => { hideModal(); }}>
                        Cancel
                  </Button>
        </DialogActions>
    </Dialog>
    );
  }
}

export default Modal;