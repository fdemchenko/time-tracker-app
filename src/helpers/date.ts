export function getNewIsoDate() {
  let date = new Date();
  date.setTime(date.getTime() + (-date.getTimezoneOffset() * 60 * 1000));
  return date.toISOString();
}

export function getNewIsoDateWithTimeZone(existingDate = new Date()) {
  const date = new Date(existingDate);
  const timeZoneOffset = date.getTimezoneOffset() * 60 * 1000;
  const newDateInTimeZone = new Date(date.getTime() - timeZoneOffset);

  return newDateInTimeZone.toISOString();
}
