import {WorkSessionWithRelations} from "../models/work-session/WorkSessionWithRelations";
import {ProcessedEvent} from "@aldabil/react-scheduler/types";
import {parseIsoDateToLocal, separateDateOnMidnight} from "../helpers/date";
import {Holiday} from "../models/Holiday";
import moment from "moment";
import {WorkSessionTypesEnum} from "../helpers/workSessionHelper";
import {rotation} from 'simpler-color'
import {SickLeave} from "../models/sick-leave/SickLeave";
import {Vacation} from "../models/vacation/Vacation";

export function getColor(colorNumber: number): string {
  const baseColor = "#47817F";
  const defaultRotationAngle = 30;
  return rotation(baseColor, colorNumber * defaultRotationAngle);
}
interface UserColorInfo {
  userId: string;
  color: string;
}
export function GetEventsFromWorkSessionList(wsList: {count: number, items: WorkSessionWithRelations[]}) {
  let events: ProcessedEvent[] = [];

  let userColorInfoList: UserColorInfo[] = [];
  let colorIndex = 0;
  wsList.items.forEach(wsData => {
    if (wsData.workSession.end) {
      let curUserColorInfo = userColorInfoList.find(uci => uci.userId === wsData.user.id);
      if (!curUserColorInfo) {
        curUserColorInfo = {userId: wsData.user.id, color: getColor(colorIndex)};
        userColorInfoList.push(curUserColorInfo);
        colorIndex++;
      }

      let startLocal = parseIsoDateToLocal(wsData.workSession.start);
      let endLocal = parseIsoDateToLocal(wsData.workSession.end);

      let timePassed = separateDateOnMidnight(startLocal, endLocal);
      timePassed.forEach(timePassesDay => {
        events.push({
          event_id: wsData.workSession.id,
          user: wsData.user,
          title: wsData.workSession.title || (wsData.workSession.type ===
            WorkSessionTypesEnum[WorkSessionTypesEnum.Planned]? "Planned" : "Working"),
          type: wsData.workSession.type,
          lastModifier: wsData.lastModifier,
          start: new Date(timePassesDay.start),
          end: new Date(timePassesDay.end),
          description: wsData.workSession.description,

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