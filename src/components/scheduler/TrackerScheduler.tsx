import {Box, Button} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Scheduler} from "@aldabil/react-scheduler";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import React, {useEffect, useRef, useState} from "react";
import {
  deleteWorkSessionActionCreator,
  getWorkSessionsByUserIdsByMonthActionCreator
} from "../../redux/epics/WorkSessionEpics";
import {DayHours, SchedulerRef} from "@aldabil/react-scheduler/types";
import {getHolidaysActionCreator} from "../../redux/epics/SchedulerEpics";
import {Outlet, useNavigate} from "react-router-dom";
import {hasPermit} from "../../helpers/hasPermit";
import SchedulerRangePicker from "./SchedulerRangePicker";
import {GetEventsFromHolidayList, GetEventsFromWorkSessionList} from "../../services/SchedulerService";
import SchedulerEvent from "./SchedulerEvent";
import SchedulerViewerExtraComponent from "./SchedulerViewerExtraComponent";
import SchedulerForm from "./SchedulerForm";

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
  }, [requireUpdateToggle]);

  useEffect(() => {
    if (schedulerRef.current) {
      let events = GetEventsFromHolidayList(holidays);

      events.push(...GetEventsFromWorkSessionList(workSessionsList));

      schedulerRef.current.scheduler.handleState(events, "events")
    }
  }, [workSessionsList, holidays]);

  async function handleDelete(deletedId: string) {
    dispatch(deleteWorkSessionActionCreator(deletedId));
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
        //disable drag and drop
        onEventDrop={() => new Promise(() => {
        })}
        hourFormat="24"
        draggable={false}

        month={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 1,
          startHour: startRange as DayHours,
          endHour: endRange as DayHours,
          navigation: true,
          disableGoToDay: false
        }}
        week={{
          weekDays: [0, 1, 2, 3, 4, 5, 6],
          weekStartOn: 1,
          startHour: startRange as DayHours,
          endHour: endRange as DayHours,
          step: 60,
          navigation: true,
          disableGoToDay: false
        }}
        day={{
          startHour: startRange as DayHours,
          endHour: endRange as DayHours,
          step: 60,
          navigation: true
        }}

        eventRenderer={({event, ...props}) => <SchedulerEvent
          event={event}
          eventRendererProps={props}
          view={schedulerRef?.current?.scheduler.view}
        />}
        viewerExtraComponent={(_, event) => <SchedulerViewerExtraComponent event={event} />}

        customEditor={(scheduler) => <SchedulerForm scheduler={scheduler} /> }
      />
    </>
  );
}
