const initState = { loggedIn: false, user: {}, error: undefined };

export default (state = initState, action) => {
  switch (action.type) {
    case "AUTH":
      return { loggedIn: true, user: action.user, error: undefined };
    case "DEAUTH":
      return { loggedIn: false, user: {}, error: undefined };
    case "ERROR":
      return { ...state, error: action.error };
    case "CLEAR":
      return { ...state, error: undefined };
    default:
      return state;
  }
};
