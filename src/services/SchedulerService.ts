import {WorkSessionWithRelations} from "../models/work-session/WorkSessionWithRelations";
import {ProcessedEvent} from "@aldabil/react-scheduler/types";
import {parseIsoDateToLocal, separateDateOnMidnight} from "../helpers/date";
import {Holiday} from "../models/Holiday";
import moment from "moment";
import {WorkSessionTypesEnum} from "../helpers/workSessionHelper";

export function GetEventsFromWorkSessionList(wsList: {count: number, items: WorkSessionWithRelations[]}) {
  let events: ProcessedEvent[] = [];

  wsList.items.map(wsData => {
    if (wsData.workSession.end) {
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
          disabled: true,
          color: wsData.workSession.type === WorkSessionTypesEnum[WorkSessionTypesEnum.Planned] ? '#68B38D' : '#47817F'
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
      end: holiday.endDate ? moment(holiday.endDate).add(23, "hours").add(59,"minutes").toDate()
        : moment(holiday.date).toDate(),

      allDay: true,
      editable: false,
      deletable: false,
      draggable: false,
      disabled: false,
      color: "#00C6CF"
    });
  });

  return events;
}