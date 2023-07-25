import moment from "moment/moment";

export function getNewIsoDateWithTimeZone(existingDate?: Date): string {
  const date = existingDate ? new Date(existingDate) : new Date;
  const timeZoneOffset = date.getTimezoneOffset() * 60 * 1000;
  const newDateInTimeZone = new Date(date.getTime() - timeZoneOffset);

  return existingDate
    ? new Date(newDateInTimeZone.getTime() - (newDateInTimeZone.getTimezoneOffset() * 60 * 1000)).toISOString()
    : new Date(newDateInTimeZone.getTime()).toISOString();
}

export function parseIsoDateToLocal(isoDate: string): string {
  let date = new Date(isoDate);
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60 * 1000)).toISOString();
}

export function isoDateToNumber(isoDate: string): number {
  return new Date(isoDate).getTime();
}

export const formatIsoDate = (dateTime: string): string => {
  const [datePart] = dateTime.split('T');

  const formattedDate = datePart.split('-').reverse().join('.');
  return `${formattedDate}`;
};

export function formatIsoDateTime(dateStr: string) {
  return moment(dateStr).format("MM/DD/YYYY HH:mm:ss");
}

export function formatIsoTime(dateStr: string) {
  return moment(dateStr).format("HH:mm:ss");
}

export function countIsoDateDiff(startIsoDate: string, finishIsoDate: string) {
  let start = moment(startIsoDate);
  let finish = moment(finishIsoDate);
  return formatIsoTime(moment(finish.diff(start)).subtract(3, "hours").toISOString());
}