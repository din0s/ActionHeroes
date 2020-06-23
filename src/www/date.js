export function parseDate(date, t) {
  const d = new Date(date);
  const day = t("date.day." + d.getDay());
  const month = t("date.month." + d.getMonth());
  const hours = d
    .getUTCHours()
    .toString()
    .padStart(2, "0");
  const mins = d
    .getUTCMinutes()
    .toString()
    .padStart(2, "0");
  const offset = "GMT"; // maybe make this dynamic in the future

  return `${day}, ${d.getDate()} ${month} ${d.getFullYear()}, ${hours}:${mins} ${offset}`;
}
