export function getNewIsoDate() {
  let date = new Date();
  date.setTime(date.getTime() + (-date.getTimezoneOffset() * 60 * 1000));
  return date.toISOString();
}

export function getNewIsoDateWithTimeZone(existingDate?: Date): string {
  const date = existingDate ? new Date(existingDate) : new Date;
  const timeZoneOffset = date.getTimezoneOffset() * 60 * 1000;
  const newDateInTimeZone = new Date(date.getTime() - timeZoneOffset);

  return existingDate
    ? new Date(newDateInTimeZone.getTime() - (newDateInTimeZone.getTimezoneOffset() * 60 * 1000)).toISOString()
    : new Date(newDateInTimeZone.getTime()).toISOString();
}

export const formatIsoDate = (dateTime: string): string => {
  const [datePart] = dateTime.split('T');

  const formattedDate = datePart.split('-').reverse().join('.');
  return `${formattedDate}`;
};