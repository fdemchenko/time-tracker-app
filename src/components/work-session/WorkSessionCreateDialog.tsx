import React, {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Autocomplete, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import {DateTimePicker} from "@mui/x-date-pickers";
import DialogActions from "@mui/material/DialogActions";
import moment from "moment/moment";
import {hasPermit, PermissionsEnum} from "../../helpers/hasPermit";
import DialogWindow from "../layout/DialogWindow";
import {getUsersWithoutPaginationActionCreator} from "../../redux/epics/UserEpics";
import User from "../../models/User";
import * as Yup from "yup";
import {useFormik} from "formik";
import {WorkSessionInput} from "../../models/work-session/WorkSessionInput";
import {WorkSessionTypesEnum} from "../../helpers/workSessionHelper";
import {createWorkSessionActionCreator} from "../../redux/epics/WorkSessionEpics";
import {SchedulerHelpers} from "@aldabil/react-scheduler/types";

interface WorkSessionCreateDialogProps {
  scheduler?: SchedulerHelpers;
}
const WorkSessionCreateDialog = ({scheduler}: WorkSessionCreateDialogProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {selectedUserId} = useParams();

  const {user} = useAppSelector(state => state.user);
  const {error} = useAppSelector(state => state.workSession);
  const usersList = useAppSelector(state => state.manageUsers.usersWithoutPagination);

  let initialUser: User = getInitialUser();
  const [userInput, setUserInput] = useState<User>(initialUser);
  const [userTextInput, setUserTextInput] = useState<string>(initialUser.fullName);

  useEffect(() => {
    dispatch(getUsersWithoutPaginationActionCreator(false));
  }, []);

  function getInitialUser(): User {
    if (hasPermit(user.permissions, PermissionsEnum[PermissionsEnum.CreateWorkSessions])
      && selectedUserId) {
      return usersList.find(u => u.id === selectedUserId) || user;
    }
    return user;
  }

  const InitialWorkSessionInput: WorkSessionInput = {
    userId: initialUser.id,
    start: "",
    end: "",
    title: "",
    description: "",
    type: WorkSessionTypesEnum[WorkSessionTypesEnum.Completed],
    lastModifierId: user.id
  };
  const validationSchema = Yup.object().shape({
    workSession: Yup.object().shape({
      userId: Yup.string().required("User is required"),
      start: Yup.string().required("Start date is required"),
      end: Yup.string().required("End date is required").test("isBefore",
        "End date should be after start date", (value, context) =>
          moment(context.parent.start).isBefore(value, "minutes")),
      title: Yup.string().notRequired().nullable(),
      description: Yup.string().notRequired().nullable(),
      type: Yup.string().required(),
      lastModifierId: Yup.string()
    })
  });
  const formik = useFormik({
    initialValues: {
      workSession: InitialWorkSessionInput
    },
    validationSchema,
    onSubmit: values => {
      let ws = values.workSession;
      ws.lastModifierId = user.id;

      dispatch(createWorkSessionActionCreator(ws));

      scheduler ? scheduler.close() : navigate(-1);
    }
  });

  return (
    <DialogWindow title="Create work session" handleClose={scheduler ? scheduler.close : () => navigate(-1)}>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 3
            }}
          >
            {
              hasPermit(user.permissions, PermissionsEnum[PermissionsEnum.CreateWorkSessions]) &&
              <Autocomplete
                getOptionLabel={(option: User) => option.fullName}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={usersList}
                renderInput={(params) => <TextField
                  {...params}
                  label="Select user"
                  error={!!formik.errors.workSession?.userId}
                  helperText={formik.touched.workSession?.userId && formik.errors.workSession?.userId}
                />}
                fullWidth
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                value={userInput}
                inputValue={userTextInput}
                onChange={(event: any, selectedUser: User | null) => {
                  setUserInput(selectedUser ? selectedUser : user);
                  formik.setFieldValue("workSession.userId", selectedUser ? selectedUser.id : user.id)
                }}
                onInputChange={(event, newInputValue) => {
                  setUserTextInput(newInputValue ? newInputValue : user.fullName);
                }}
              />
            }

            <TextField
              label="Optional title"
              variant="outlined"
              fullWidth
              {...formik.getFieldProps('workSession.title')}
            />

            <DateTimePicker
              label="Session start date"
              ampm={false}
              value={moment(formik.values.workSession.start)}
              onChange={(newDate) => formik.setFieldValue("workSession.start",
                newDate ? newDate.toISOString() : undefined, true)}
              dayOfWeekFormatter={(day) => `${day}`}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!formik.touched.workSession?.start && !!formik.errors.workSession?.start,
                  helperText: formik.touched.workSession?.start && formik.errors.workSession?.start
                }
              }}
            />

            <DateTimePicker
              label="Session end date"
              ampm={false}
              value={moment(formik.values.workSession.end)}
              onChange={(newDate) => formik.setFieldValue("workSession.end",
                newDate ? newDate.toISOString() : undefined, true)}
              dayOfWeekFormatter={(day) => `${day}`}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!formik.touched.workSession?.end && !!formik.errors.workSession?.end,
                  helperText: formik.touched.workSession?.end && formik.errors.workSession?.end
                }
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="type_select_label">Type</InputLabel>
              <Select
                labelId="type_select_label"
                label="Type"
                value={formik.values.workSession.type}
                onChange={(e) => {
                  formik.setFieldValue("workSession.type", e.target.value);
                }}
                variant="outlined"
                fullWidth
              >
                <MenuItem value={`${WorkSessionTypesEnum[WorkSessionTypesEnum.Completed]}`}>Completed</MenuItem>
                <MenuItem value={`${WorkSessionTypesEnum[WorkSessionTypesEnum.Planned]}`}>Planned</MenuItem>
              </Select>
            </FormControl>

            <TextField
              label="Optional description"
              variant="outlined"
              multiline
              minRows={3}
              fullWidth
              {...formik.getFieldProps('workSession.description')}
            />
          </Box>
          {
            error && <Alert severity="error" sx={{m: 2}}>{error}</Alert>
          }
        </DialogContent>
        <DialogActions sx={{mx: 3, my: 2}}>
          <Button
            size="large"
            type="submit"
          >
            Create
          </Button>
          <Button
            size="large"
            color="secondary"
            onClick={scheduler ? scheduler.close : () => navigate(-1)}
          >
            Back
          </Button>
        </DialogActions>
      </form>
    </DialogWindow>
  );
};

export default WorkSessionCreateDialog;