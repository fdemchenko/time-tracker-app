import {WorkSessionWithRelations} from "../models/work-session/WorkSessionWithRelations";
import {ProcessedEvent} from "@aldabil/react-scheduler/types";
import {parseIsoDateToLocal, separateDateOnMidnight} from "../helpers/date";
import {Holiday} from "../models/Holiday";
import moment from "moment";
import {WorkSessionTypesEnum} from "../helpers/workSessionHelper";
import {VacationResponse} from "../models/vacation/VacationResponse";
import {SickLeaveWithRelations} from "../models/sick-leave/SickLeaveWithRelations";

function getColor(index: number): string {
  const colors = ["#47817F", "#3B8093", "#4D7BA2", "#7272A4", "#966795", "#AD5E78"];
  return colors[index % colors.length];
}
interface UserColorInfo {
  userId: string;
  color: string;
}
export function GetEventsFromWorkSessionList(wsList: {count: number, items: WorkSessionWithRelations[]}) {
  let events: ProcessedEvent[] = [];

  let userColorInfoList: UserColorInfo[] = [];
  let colorIndex = 0;
  wsList.items.map(wsData => {
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
      timePassed.map(timePassesDay => {
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

  holidayList.map(holiday => {
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

export function GetEventsFromVacationList(vacationDataList: VacationResponse[]) {
  let events: ProcessedEvent[] = [];

  vacationDataList.map(vd => {
    events.push({
      event_id: vd.vacation.id,
      title: "Vacation",
      user: vd.user,
      approver: vd.approver,
      type: "Vacation",
      start: moment(vd.vacation.start).toDate(),
      end: scaleEndDateToSchedulerEndDayEvent(vd.vacation.end),

      allDay: true,
      editable: false,
      deletable: false,
      draggable: false,
      color: "#C3AC4F"
    });
  });

  return events;
}

export function GetEventsFromSickLeaveList(sickLeaveDataList: SickLeaveWithRelations[]) {
  let events: ProcessedEvent[] = [];

  sickLeaveDataList.map(sld => {
    events.push({
      event_id: sld.sickLeave.id,
      title: "Sick Leave",
      user: sld.user,
      lastModifier: sld.lastModifier,
      type: "SickLeave",
      start: moment(sld.sickLeave.start).toDate(),
      end: scaleEndDateToSchedulerEndDayEvent(sld.sickLeave.end),

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