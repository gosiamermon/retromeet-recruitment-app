export const SHOW_COL_SELECTION_MODAL = 'SHOW_COL_SELECTION_MODAL';
export const HIDE_COL_SELECTION_MODAL = 'HIDE_COL_SELECTION_MODAL';

export const showColSelectionModal = (text, submitAction) => (dispatch) => {
  dispatch({ type: SHOW_COL_SELECTION_MODAL });
};

export const hideModal = () => (dispatch) => {
  dispatch({ type: HIDE_COL_SELECTION_MODAL });
};