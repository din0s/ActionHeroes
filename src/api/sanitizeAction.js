const sanitizeAction = (action) => {
  action = action.toJSON();

  action.__v = undefined;
  action.attendees = undefined;
  action.saves = undefined;
  action.dateCreated = undefined;
  action.organizer = undefined;
  action.categories = action.categories.map((c) => c.name);

  return action;
};

module.exports = sanitizeAction;
