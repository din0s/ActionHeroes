const initState = {
  handshake: false,
  loggedIn: false,
  updated: false,
  user: {},
  error: undefined,
};

const attendAction = (user, action) => {
  user.actionsAttended.push(action);
  return user;
};

const unattendAction = (user, id) => {
  user.actionsAttended = user.actionsAttended.filter((a) => a._id !== id);
  return user;
};

const deleteAction = (user, id) => {
  const attendIndex = user.actionsAttended.findIndex((a) => a._id === id);
  const saveIndex = user.actionsSaved.findIndex((a) => a._id === id);
  if (attendIndex !== -1) {
    user.actionsAttended.splice(attendIndex, 1);
  }
  if (saveIndex !== -1) {
    user.actionsSaved.splice(saveIndex, 1);
  }
  return user;
};

const editAction = (user, action) => {
  const attendIndex = user.actionsAttended.findIndex(
    (a) => a._id === action._id
  );
  const saveIndex = user.actionsSaved.findIndex((a) => a._id === action._id);
  if (attendIndex !== -1) {
    user.actionsAttended[attendIndex] = action;
  }
  if (saveIndex !== -1) {
    user.actionsSaved[saveIndex] = action;
  }
  return user;
};

const saveAction = (user, action) => {
  user.actionsSaved.push(action);
  return user;
};

const unsaveAction = (user, id) => {
  user.actionsSaved = user.actionsSaved.filter((a) => a._id !== id);
  return user;
};

const createTeam = (user, team) => {
  user.teamsOwned.push(team);
  return user;
};

const deleteTeam = (user, id) => {
  const index = user.teamsOwned.findIndex((t) => t._id === id);
  if (index !== -1) {
    user.teamsOwned.splice(index, 1);
  }
  return user;
};

const editTeam = (user, team) => {
  const index = user.teamsOwned.findIndex((t) => t._id === team._id);
  user.teamsOwned[index] = team;
  return user;
};

const followTeam = (user, team) => {
  user.teamsFollow.push(team);
  return user;
};

const unfollowTeam = (user, id) => {
  user.teamsFollow = user.teamsFollow.filter((t) => t._id !== id);
  return user;
};

export default (state = initState, action) => {
  switch (action.type) {
    case "HANDSHAKE":
      return {
        ...state,
        handshake: true,
        loggedIn: action.success,
        user: action.user,
      };
    case "AUTH":
      return { ...state, loggedIn: true, user: action.user, error: undefined };
    case "DEAUTH":
      return { ...state, loggedIn: false, user: {} };
    case "ERROR":
      return { ...state, error: action.error };
    case "CLEAR":
      return { ...state, error: undefined };
    case "UPDATE":
      return { ...state, updated: true, user: action.user };
    case "IDLE":
      return { ...state, updated: false };
    case "ATTEND_ACTION":
      return { ...state, user: attendAction(state.user, action.data) };
    case "UNATTEND_ACTION":
      return { ...state, user: unattendAction(state.user, action.data) };
    case "DELETE_ACTION":
      return { ...state, user: deleteAction(state.user, action.data) };
    case "EDIT_ACTION":
      return { ...state, user: editAction(state.user, action.data) };
    case "SAVE_ACTION":
      return { ...state, user: saveAction(state.user, action.data) };
    case "UNSAVE_ACTION":
      return { ...state, user: unsaveAction(state.user, action.data) };
    case "CREATE_TEAM":
      return { ...state, user: createTeam(state.user, action.data) };
    case "DELETE_TEAM":
      return { ...state, user: deleteTeam(state.user, action.data) };
    case "EDIT_TEAM":
      return { ...state, user: editTeam(state.user, action.data) };
    case "FOLLOW_TEAM":
      return { ...state, user: followTeam(state.user, action.data) };
    case "UNFOLLOW_TEAM":
      return { ...state, user: unfollowTeam(state.user, action.data) };
    default:
      return state;
  }
};
