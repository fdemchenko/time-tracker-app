import {ProcessedEvent} from "@aldabil/react-scheduler/types";
import {parseIsoDateToLocal, separateDateOnMidnight} from "../helpers/date";
import {Holiday} from "../models/Holiday";
import moment from "moment";
import {WorkSessionTypesEnum} from "../helpers/workSessionHelper";
import {rotation} from 'simpler-color'
import {SickLeave} from "../models/sick-leave/SickLeave";
import {Vacation} from "../models/vacation/Vacation";
import WorkSession from "../models/work-session/WorkSession";
import User from "../models/User";

export function getUserColors(users: User[]): UserColorInfo[] {
  const baseColor = "#47817F";
  const defaultRotationAngle = 30;

  let userColorInfoList: UserColorInfo[] = [];
  users.forEach((user, index) => {
    userColorInfoList.push({
      userId: user.id,
      color: rotation(baseColor, index * defaultRotationAngle)
    });
  });

  return userColorInfoList;
}
export interface UserColorInfo {
  userId: string;
  color: string;
}
export function GetEventsFromWorkSessionList(workSessionList: {count: number, items: WorkSession[]}, colors: UserColorInfo[]) {
  let events: ProcessedEvent[] = [];

  workSessionList.items.forEach(ws => {
    if (ws.end) {
      const curUserColorInfo = colors.find(uci => uci.userId === ws.userId);

      let startLocal = parseIsoDateToLocal(ws.start);
      let endLocal = parseIsoDateToLocal(ws.end);

      let timePassed = separateDateOnMidnight(startLocal, endLocal);
      timePassed.forEach(timePassesDay => {
        events.push({
          event_id: ws.id,
          userId: ws.userId,
          title: ws.title || (ws.type ===
            WorkSessionTypesEnum[WorkSessionTypesEnum.Planned]? "Planned" : "Working"),
          type: ws.type,
          lastModifierId: ws.lastModifierId,
          start: new Date(timePassesDay.start),
          end: new Date(timePassesDay.end),
          description: ws.description,

          allDay: false,
          draggable: false,
          color: curUserColorInfo?.color
        });
      });
    }
  });

  return events;
}

export function GetEventsFromHolidayList(holidayList: Holiday[]) {
  let events: ProcessedEvent[] = [];

  holidayList.forEach(holiday => {
    events.push({
      event_id: holiday.id,
      title: holiday.title,
      type: holiday.type,
      start: moment(holiday.date).toDate(),
      end: holiday.endDate ? scaleEndDateToSchedulerEndDayEvent(holiday.endDate)
        : moment(holiday.date).toDate(),

      allDay: true,
      editable: false,
      deletable: false,
      draggable: false,
      color: "#00C6CF"
    });
  });

  return events;
}

export function GetEventsFromVacationList(vacationList: Vacation[]) {
  let events: ProcessedEvent[] = [];

  vacationList.forEach(vacation => {
    events.push({
      event_id: vacation.id,
      title: "Vacation",
      userId: vacation.userId,
      approverId: vacation.approverId,
      type: "Vacation",
      start: moment(vacation.start).toDate(),
      end: scaleEndDateToSchedulerEndDayEvent(vacation.end),

      allDay: true,
      editable: false,
      deletable: false,
      draggable: false,
      color: "#C3AC4F"
    });
  });

  return events;
}

export function GetEventsFromSickLeaveList(sickLeaveList: SickLeave[]) {
  let events: ProcessedEvent[] = [];

  sickLeaveList.forEach(sl => {
    events.push({
      event_id: sl.id,
      title: "Sick Leave",
      userId: sl.userId,
      lastModifierId: sl.lastModifierId,
      type: "SickLeave",
      start: moment(sl.start).toDate(),
      end: scaleEndDateToSchedulerEndDayEvent(sl.end),

      allDay: true,
      editable: false,
      deletable: false,
      draggable: false,
      color: "#f66867"
    });
  });

  return events;
}

export function scaleEndDateToSchedulerEndDayEvent(endDateStr: string): Date {
  return moment(endDateStr).add(23, "hours").add(59,"minutes").toDate();
}

export function isWorkSessionEvent(event: ProcessedEvent): boolean {
  return event.type === WorkSessionTypesEnum[WorkSessionTypesEnum.Completed]
    || event.type === WorkSessionTypesEnum[WorkSessionTypesEnum.Planned]
    || event.type === WorkSessionTypesEnum[WorkSessionTypesEnum.Auto];
}

export function isPlannedEvent(event: ProcessedEvent): boolean {
  return event.type === WorkSessionTypesEnum[WorkSessionTypesEnum.Planned];
}

export function isVacationEvent(event: ProcessedEvent): boolean {
  return event.type === "Vacation";
}

export function isSickLeaveEvent(event: ProcessedEvent): boolean {
  return event.type === "SickLeave";
}