import {Box, Button} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Scheduler} from "@aldabil/react-scheduler";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import React, {useEffect, useRef, useState} from "react";
import {
  createWorkSessionActionCreator,
  deleteWorkSessionActionCreator,
  getWorkSessionsByUserIdsByMonthActionCreator,
  updateWorkSessionActionCreator
} from "../../redux/epics/WorkSessionEpics";
import {formatIsoTime} from "../../helpers/date";
import {DayHours, EventActions, ProcessedEvent, SchedulerRef} from "@aldabil/react-scheduler/types";
import {SetGlobalMessage} from "../../redux/slices/GlobalMessageSlice";
import {getHolidaysActionCreator} from "../../redux/epics/SchedulerEpics";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {hasPermit} from "../../helpers/hasPermit";
import {WorkSessionTypesEnum} from "../../helpers/workSessionHelper";
import SchedulerRangePicker from "./SchedulerRangePicker";
import {GetEventsFromHolidayList, GetEventsFromWorkSessionList} from "../../services/SchedulerService";
import SchedulerEvent from "./SchedulerEvent";
import SchedulerViewerExtraComponent from "./SchedulerViewerExtraComponent";

export default function TrackerScheduler() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {workSessionsList, requireUpdateToggle, isLoading} = useAppSelector(state => state.workSession);
  const {holidays} = useAppSelector(state => state.scheduler);

  const {user} = useAppSelector(state => state.user);

  const [startRange, setStartRange] = useState<number>(8);
  const [endRange, setEndRange] = useState<number>(20);

  const schedulerRef = useRef<SchedulerRef>(null);

  useEffect(() => {
    if (schedulerRef.current) {
      dispatch(getWorkSessionsByUserIdsByMonthActionCreator({
        userIds: [user.id],
        monthDate: schedulerRef.current.scheduler.selectedDate.toISOString()
      }));

      dispatch(getHolidaysActionCreator());
    }
  }, []);

  useEffect(() => {
    if (schedulerRef.current) {
      let events = GetEventsFromWorkSessionList(workSessionsList);

      events.push(...GetEventsFromHolidayList(holidays));

      schedulerRef.current.scheduler.handleState(events, "events")
    }
  }, [requireUpdateToggle, holidays]);

  async function handleDelete(deletedId: string) {
    dispatch(deleteWorkSessionActionCreator(deletedId));
  }

  async function handleConfirm(
    event: ProcessedEvent,
    action: EventActions
  ): Promise<ProcessedEvent> {
    return new Promise(() => {
      if (!isNaN(event.start.getTime()) && !isNaN(event.end.getTime()) && user.id) {
        if (action === "edit" && (/*id === user.id ||*/ hasPermit(user.permissions, "UpdateWorkSessions"))) {
          dispatch(updateWorkSessionActionCreator(event.event_id.toString(), {
            start: event.start.toISOString(),
            end: event.end.toISOString(),
            title: event.title,
            description: event.description,
            lastModifierId: user.id
          }));

        } else if (action === "create" && (/*id === user.id ||*/ hasPermit(user.permissions, "CreateWorkSessions"))) {
          dispatch(createWorkSessionActionCreator({
            userId: user.id,
            start: event.start.toISOString(),
            end: event.end.toISOString(),
            type: WorkSessionTypesEnum[WorkSessionTypesEnum.Planned],
            title: event.title,
            description: event.description,
            lastModifierId: user.id,
          }));
        }

      } else {
        dispatch(SetGlobalMessage({
          title: "Validation Error",
          message: "Date or user is invalid",
          type: "warning"
        }));
      }
    });
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 4
        }}
      >
        <Typography variant="h3" gutterBottom>
          Scheduler
        </Typography>
        {hasPermit(user.permissions, "ManageHolidays") &&
          <Button
            sx={{mb: 2}}
            size="large"
            variant="contained"
            onClick={() => navigate("/holidays")}
          >
            Manage holidays
          </Button>
        }
      </Box>

      <SchedulerRangePicker
        startRange={startRange}
        setStartRange={setStartRange}
        endRange={endRange}
        setEndRange={setEndRange}
      />

      <Outlet/>

      <Scheduler
        fields={[
          {
            name: "description",
            type: "input",
            config: {
              label: "Description",
              required: false,
              multiline: true,
              rows: 4
            }
          }
        ]}
        ref={schedulerRef}
        loading={isLoading}
        onDelete={handleDelete}
        onConfirm={handleConfirm}
        //disable drag and drop
        onEventDrop={() => new Promise(() => {
        })}
        hourFormat="24"
        draggable={false}

        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 1,
          startHour: startRange as DayHours,
          endHour: endRange as DayHours,
          step: 60,
          navigation: true,
          disableGoToDay: false,
        }}
        month={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 1,
          startHour: 0,
          endHour: 24,
          navigation: true,
          disableGoToDay: false
        }}
        day={{
          startHour: 0,
          endHour: 24,
          step: 60,
          navigation: true
        }}

        eventRenderer={({event, ...props}) => <SchedulerEvent event={event} eventRendererProps={props} />}
        viewerExtraComponent={(_, event) => <SchedulerViewerExtraComponent event={event} />}
      />
    </>
  );
}
