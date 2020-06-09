const initState = {
  handshake: false,
  loggedIn: false,
  updated: false,
  user: {},
  error: undefined,
};

export default (state = initState, action) => {
  switch (action.type) {
    case "HANDSHAKE":
      return { ...state, handshake: true, loggedIn: action.success, user: action.user };
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
    default:
      return state;
  }
};
