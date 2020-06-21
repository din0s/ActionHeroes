export const attendAction = (action, toggle) => {
  return (dispatch) => {
    if (toggle) {
      dispatch({ type: "ATTEND_ACTION", data: action });
    } else {
      dispatch({ type: "UNATTEND_ACTION", data: action._id });
    }
  };
};

export const deleteAction = (id) => ({ type: "DELETE_ACTION", data: id });

export const editAction = (action) => ({ type: "EDIT_ACTION", data: action });

export const saveAction = (action, toggle) => {
  return (dispatch) => {
    if (toggle) {
      dispatch({ type: "SAVE_ACTION", data: action });
    } else {
      dispatch({ type: "UNSAVE_ACTION", data: action._id });
    }
  };
};
