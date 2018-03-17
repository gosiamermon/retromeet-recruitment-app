export const SHOW_MODAL = 'SHOW_MODAL';
export const HIDE_MODAL = 'HIDE_MODAL';

export const showModal = (text, submitAction) => (dispatch) => {
  dispatch({ type: SHOW_MODAL, payload: { text, submitAction }
  });
};

export const hideModal = () => (dispatch) => {
  dispatch({ type: HIDE_MODAL });
};