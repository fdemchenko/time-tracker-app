import {Autocomplete, Box, Button, Chip, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Scheduler} from "@aldabil/react-scheduler";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import React, {useEffect, useRef, useState} from "react";
import {
  deleteWorkSessionActionCreator,
  getWorkSessionsByUserIdsByMonthActionCreator
} from "../../redux/epics/WorkSessionEpics";
import {DayHours, SchedulerRef} from "@aldabil/react-scheduler/types";
import {getHolidaysForMontyActionCreator} from "../../redux/epics/HolidayEpics";
import {Outlet, useParams} from "react-router-dom";
import {hasPermit} from "../../helpers/hasPermit";
import SchedulerFilterPopup from "./SchedulerFilterPopup";
import {
  getUserColors,
  GetEventsFromHolidayList, GetEventsFromSickLeaveList,
  GetEventsFromVacationList,
  GetEventsFromWorkSessionList
} from "../../services/SchedulerService";
import SchedulerEvent from "./SchedulerEvent";
import SchedulerViewerExtraComponent from "./SchedulerViewerExtraComponent";
import SchedulerForm from "./SchedulerForm";
import User from "../../models/User";
import {getUsersWithoutPaginationActionCreator} from "../../redux/epics/UserEpics";
import HolidaysDialog from "./HolidaysDialog";
import {getUsersVacationsForMonthActionCreator} from "../../redux/epics/VacationEpics";
import {getUsersSickLeavesForMonthActionCreator} from "../../redux/epics/SickLeaveEpics";
import moment from "moment";

export default function TrackerScheduler() {
  const dispatch = useAppDispatch();
  const {selectedUserId} = useParams();

  const {workSessionsList, requireUpdateToggle, isLoading} = useAppSelector(state => state.workSession);
  const {holidays} = useAppSelector(state => state.scheduler);
  const {vacationList} = useAppSelector(state => state.vacation);
  const {sickLeaveList} = useAppSelector(state => state.sickLeave);

  const {user} = useAppSelector(state => state.user);
  const usersList = useAppSelector(state => state.manageUsers.usersWithoutPagination);

  const initialUser: User = getInitialSelectedUser();
  const [userInput, setUserInput] = useState<User[]>([initialUser]);
  const [userTextInput, setUserTextInput] = useState<string>(initialUser.fullName);
  const userTagColors = getUserColors(userInput);

  const [hidePlanned, setHidePlanned] = useState<boolean>(false);

  const [holidayDialogOpen, setHolidayDialogOpen] = useState<boolean>(false);

  const [startRange, setStartRange] = useState<number>(8);
  const [endRange, setEndRange] = useState<number>(20);

  const schedulerRef = useRef<SchedulerRef>(null);
  const [dateToCompare, setDateToCompare] = useState<Date>(new Date());
  const [schedulerDate, setSchedulerDate] = useState<Date>(dateToCompare);

  useEffect(() => {
    if (schedulerRef.current) {
      refreshSchedulerData();
    }
  }, [requireUpdateToggle, userInput, hidePlanned]);

  useEffect(() => {
    if (!moment(schedulerDate).isSame(dateToCompare, "months")) {
      refreshSchedulerData();

      setDateToCompare(schedulerDate);
    }
  }, [schedulerDate]);

  useEffect(() => {
    if (schedulerRef.current) {
      let events = GetEventsFromHolidayList(holidays);

      events.push(...GetEventsFromWorkSessionList(workSessionsList, userTagColors));

      events.push(...GetEventsFromVacationList(vacationList));

      events.push(...GetEventsFromSickLeaveList(sickLeaveList));

      schedulerRef.current.scheduler.handleState(events, "events");
    }
  }, [workSessionsList, holidays, vacationList, sickLeaveList]);

  function refreshSchedulerData() {
    const userIds = userInput.map(u => u.id);
    const monthDate = schedulerDate.toISOString();

    dispatch(getWorkSessionsByUserIdsByMonthActionCreator({
      userIds: userIds,
      monthDate: monthDate,
      hidePlanned: hidePlanned
    }));

    dispatch(getHolidaysForMontyActionCreator(monthDate));

    dispatch(getUsersWithoutPaginationActionCreator(false));

    dispatch(getUsersVacationsForMonthActionCreator({
      userIds: userIds,
      monthDate: monthDate
    }));

    dispatch(getUsersSickLeavesForMonthActionCreator({
      userIds: userIds,
      monthDate: monthDate
    }));
  }

  function getInitialSelectedUser(): User {
    if (selectedUserId) {
      return usersList.find(u => u.id === selectedUserId) || user;
    }
    return user;
  }

  async function handleDelete(deletedId: string) {
    dispatch(deleteWorkSessionActionCreator(deletedId));
  }

  return (
    <>
      <HolidaysDialog open={holidayDialogOpen} setOpen={setHolidayDialogOpen} />

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
            onClick={() => setHolidayDialogOpen(true)}
          >
            Manage holidays
          </Button>
        }
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "stretch",
          gap: 3
        }}
      >
        <SchedulerFilterPopup
          startRange={startRange}
          setStartRange={setStartRange}
          endRange={endRange}
          setEndRange={setEndRange}
          hidePlanned={hidePlanned}
          setHidePlanned={setHidePlanned}
        />

        <Autocomplete
          multiple
          getOptionLabel={(option: User) => option.fullName}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          options={usersList}
          renderInput={(params) => <TextField
            {...params}
            label="Select users"
          />}
          sx={{
            width: "auto",
            minWidth: "200px"
          }}
          renderTags={(value, getTagProps) =>
            value.map((user, index) => (
              <Chip
                sx={{
                  backgroundColor: userTagColors.find(ci => ci.userId === user.id)?.color,
                  color: "white"
                }}
                label={user.fullName}
                {...getTagProps({index})}
              />
            ))
          }
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          value={userInput}
          inputValue={userTextInput}
          onChange={(_: any, value: User[]) => {
            setUserInput(value);
          }}
          onInputChange={(_, newInputValue) => {
            setUserTextInput(newInputValue);
          }}
        />
      </Box>

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
        selectedDate={schedulerDate}
        onSelectedDateChange={(newDate) => setSchedulerDate(newDate)}
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
        />}
        viewerExtraComponent={(_, event) => <SchedulerViewerExtraComponent event={event} />}

        customEditor={(scheduler) => <SchedulerForm scheduler={scheduler} /> }
      />
    </>
  );
}