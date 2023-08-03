import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {useNavigate} from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {Alert, Box, Button, MenuItem, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {DateTimePicker} from "@mui/x-date-pickers";
import DialogActions from "@mui/material/DialogActions";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import moment, {Moment} from "moment/moment";
import {createWorkSessionActionCreator} from "../../redux/epics/WorkSessionEpics";
import {SetGlobalMessage} from "../../redux/slices/GlobalMessageSlice";

const WorkSessionCreateDialog = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {user} = useAppSelector(state => state.user);
  const {error} = useAppSelector(state => state.workSession);

  const [start, setStart] = useState<Moment | null>(moment().local());
  const [end, setEnd] = useState<Moment | null>(moment().local());
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [type, setType] = useState<string>("completed");

  const [isRequireChange, setIsRequireChange] = useState<boolean>(true);

  function handleUpdate() {
    if (start?.isValid() && end?.isValid()) {
      start.set("seconds", 0);
      end?.set("seconds", 0);
      dispatch(createWorkSessionActionCreator({
        UserId: user.id,
        Start: start.toISOString(),
        End: end.toISOString(),
        Title: title,
        Description: description,
        Type: type
      }));
    }
    else {
      dispatch(SetGlobalMessage({
        title: "Validation Error",
        message: "Date is invalid",
        type: "warning"
      }));
    }
    setIsRequireChange(true);
  }

  return (
    <Dialog
      open={true}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => navigate(-1)}
      aria-describedby="work-session-create-dialog"
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "80px"
          }}
        >
          <Typography variant="h5">Work session record create</Typography>
          <CloseIcon
            sx={{cursor: "pointer"}}
            onClick={() => navigate(-1)}
          />
        </Box>
      </DialogTitle>
      <Divider sx={{mb: 2}}/>
      {
          (
            <>
              <DialogContent>
                <DialogContentText>
                  You can create work session here
                </DialogContentText>
                <Box
                  sx={{
                    m: 4,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "45px"
                  }}
                >
                  <TextField
                    label="Title"
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setIsRequireChange(false);
                    }}
                    variant="outlined"
                    style={{ width: 260 }}
                    size="small"
                  />

                  <DateTimePicker
                    label="Session start date"
                    ampm={false}
                    value={start}
                    onChange={(newValue) => {
                      setIsRequireChange(false);
                      setStart(newValue);
                    }}
                    dayOfWeekFormatter={(day) => `${day}`}
                  />
                    <DateTimePicker
                      label="Session end date"
                      ampm={false}
                      value={end}
                      onChange={(newValue) => {
                        setIsRequireChange(false);
                        setEnd(newValue);
                      }}
                      dayOfWeekFormatter={(day) => `${day}`}
                    />

                  <Select
                    label="Status"
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value);
                      setIsRequireChange(false);
                    }}
                    variant="outlined"
                    size="small"
                    style={{ width: 260 }}
                  >
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="planned">Planned</MenuItem>
                  </Select>

                  <TextField
                    label="Description"
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value);
                      setIsRequireChange(false);
                    }}
                    variant="outlined"
                    multiline
                    rows={4}
                    size="small"
                    style={{ width: 260 }}
                  />
                </Box>
                {
                  error && <Alert severity="error" sx={{m: 2}}>{error}</Alert>
                }
              </DialogContent>
              <DialogActions sx={{mx: 3, my: 2}}>
                <Button
                  size="large"
                  onClick={handleUpdate}
                  disabled={isRequireChange}
                >
                  Create
                </Button>
                <Button
                  size="large"
                  color="secondary"
                  onClick={() => navigate(-1)}
                >
                  Back
                </Button>
              </DialogActions>
            </>
          )
      }
    </Dialog>
  );
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default WorkSessionCreateDialog;
