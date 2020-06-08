const initState = { data: [] };

export default (state = initState, action) => {
  switch (action.type) {
    case "CATEGORIES":
      return { data: action.data };
    default:
      return state;
  }
};
