export const ACTION_GROUP_ADD = 'cardsGroup/add';
export const GROUP_ADD_IN_PROGRESS = 'GROUP_ADD_IN_PROGRESS';
export const GROUP_ADD_SUCCESS = 'GROUP_ADD_SUCCESS';
export const GROUP_ADD_FAILURE = 'GROUP_ADD_FAILURE';

export const ACTION_GROUP_EDIT = 'cardsGroup/edit';
export const GROUP_EDIT_IN_PROGRESS = 'GROUP_EDIT_IN_PROGRESS';
export const GROUP_EDIT_SUCCESS = 'GROUP_EDIT_SUCCESS';
export const GROUP_EDIT_FAILURE = 'GROUP_EDIT_FAILURE';

export const ACTION_GROUP_REMOVE = 'cardsGroup/remove';
export const GROUP_REMOVE_IN_PROGRESS = 'GROUP_REMOVE_IN_PROGRESS';
export const GROUP_REMOVE_SUCCESS = 'GROUP_REMOVE_SUCCESS';
export const GROUP_REMOVE_FAILURE = 'GROUP_REMOVE_FAILURE';

export const groupAdd = (socket, columnId, cardsIds) => (dispatch) => {
  socket.emit(ACTION_GROUP_ADD, { columnId, cardsIds });
  dispatch({ type: GROUP_ADD_IN_PROGRESS });
};

export const groupRemove = (socket, groupId) => (dispatch) => {
  socket.emit(ACTION_GROUP_REMOVE, { id: groupId });
  dispatch({ type: GROUP_REMOVE_IN_PROGRESS });
};

export const groupEdit = (socket, group) => (dispatch) => {
  socket.emit(ACTION_GROUP_EDIT, group);
  dispatch({ type: GROUP_EDIT_IN_PROGRESS });
};
