const sanitizeTeam = (team) => {
  team = team.toJSON();
  team.__v = undefined;
  team.owner = undefined;
  team.categories = team.categories.map((c) => c.name);

  return team;
};

module.exports = sanitizeTeam;
