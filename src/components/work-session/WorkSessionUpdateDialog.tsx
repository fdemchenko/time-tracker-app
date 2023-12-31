import React from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Box, Button, TextField} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import {DateTimePicker} from "@mui/x-date-pickers";
import DialogActions from "@mui/material/DialogActions";
import moment from "moment/moment";
import {hasPermit, PermissionsEnum} from "../../helpers/hasPermit";
import DialogWindow from "../layout/DialogWindow";
import * as Yup from "yup";
import {useFormik} from "formik";
import {WorkSessionUpdateInput} from "../../models/work-session/WorkSessionUpdateInput";
import {parseIsoDateToLocal} from "../../helpers/date";
import AccessDenied from "../AccessDenied";
import {updateWorkSessionActionCreator} from "../../redux/epics/WorkSessionEpics";
import {SchedulerHelpers} from "@aldabil/react-scheduler/types";

interface WorkSessionCreateDialogProps {
  scheduler?: SchedulerHelpers;
}
export default function WorkSessionUpdateDialog({scheduler}: WorkSessionCreateDialogProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {workSessionId} = useParams();

  const {user} = useAppSelector(state => state.user);
  const {workSessionsList, error} = useAppSelector(state => state.workSession);

  const curWorkSessionId = scheduler?.edited ? scheduler.edited.event_id.toString() : workSessionId;
  const curWorkSession = workSessionsList.items.find(ws => ws.id === curWorkSessionId);

  const InitialWorkSessionInput: WorkSessionUpdateInput = getInitialFormValue();

  function getInitialFormValue(): WorkSessionUpdateInput {
    return {
      start: curWorkSession?.start ? parseIsoDateToLocal(curWorkSession?.start)
        : moment().toISOString(),
      end: curWorkSession?.end ? parseIsoDateToLocal(curWorkSession?.end)
        : moment().toISOString(),
      title: curWorkSession?.title || "",
      description: curWorkSession?.description || "",
      lastModifierId: user.id
    };
  }

  const validationSchema = Yup.object().shape({
    workSession: Yup.object().shape({
      start: Yup.string().required("Start date is required"),
      end: Yup.string().required("End date is required").test("isBefore",
        "End date should be after start date", (value, context) =>
          moment(context.parent.start).isBefore(value, "minutes")),
      title: Yup.string().notRequired().nullable(),
      description: Yup.string().notRequired().nullable(),
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

      if (curWorkSessionId && curWorkSession) {
        dispatch(updateWorkSessionActionCreator(curWorkSessionId, ws));
      }

      scheduler ? scheduler.close() : navigate(-1);
    }
  });

  return (
    <DialogWindow title="Update work session" handleClose={scheduler ? scheduler.close : () => navigate(-1)}>
      {
        !hasPermit(user.permissions, PermissionsEnum[PermissionsEnum.UpdateWorkSessions])
        && curWorkSession?.userId !== user.id ?
          (<AccessDenied/>)
          : !curWorkSession ? (
              <Alert severity="error" sx={{m: 2}}>Can not find this work session</Alert>
            ) :
            (
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
                    disabled={!formik.dirty}
                  >
                    Update
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
            )
      }
    </DialogWindow>
  );
};