export const modifyTeam = (team, isCreate) => {
  return (dispatch) => {
    if (isCreate) {
      dispatch({ type: "CREATE_TEAM", data: team });
    } else {
      dispatch({ type: "EDIT_TEAM", data: team._id });
    }
  };
};

export const followTeam = (team, toggle) => {
  return (dispatch) => {
    if (toggle) {
      dispatch({ type: "FOLLOW_TEAM", data: team });
    } else {
      dispatch({ type: "UNFOLLOW_TEAM", data: team._id });
    }
  };
};
