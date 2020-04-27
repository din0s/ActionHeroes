export function parseDate(date, t) {
  const d = new Date(date);
  const day = t("date.day." + d.getDay());
  const month = t("date.month." + d.getMonth());

  return `${day}, ${d.getDate()} ${month} ${d.getFullYear()}, 
      ${d.getUTCHours()}:${d.getUTCMinutes()}`;
}
