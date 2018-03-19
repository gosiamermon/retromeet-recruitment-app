export const SHOW_CONFIRM_MODAL = 'SHOW_CONFIRM_MODAL';
export const HIDE_CONFIRM_MODAL = 'HIDE_CONFIRM_MODAL';

export const showConfirmModal = (text, submitAction) => (dispatch) => {
  dispatch({ type: SHOW_CONFIRM_MODAL, payload: { text, submitAction }
  });
};

export const hideModal = () => (dispatch) => {
  dispatch({ type: HIDE_CONFIRM_MODAL });
};