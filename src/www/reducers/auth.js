const initState = { loggedIn: false, user: {} };

export default (state = initState, action) => {
  switch (action.type) {
    case "AUTH":
      return { ...state, user: action.user };
    case "DEAUTH":
      return { ...state, loggedIn: false, user: {} };
    default:
      return state;
  }
};
