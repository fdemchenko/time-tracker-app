import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Box, Button, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';
import Divider from "@mui/material/Divider";
import {DateTimePicker} from "@mui/x-date-pickers";
import {useState} from "react";
import moment, {Moment} from "moment";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {updateWorkSessionActionCreator} from "../../redux/epics/WorkSessionEpics";
import {SetGlobalMessage} from "../../redux/slices/GlobalMessageSlice";

export default function WorkSessionUpdateDialog() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {id} = useParams();

    const workSession = useAppSelector(state =>
        state.workSession.workSessionsList.items.find(ws => ws.id === id));
    const {user} = useAppSelector(state => state.user);
    const {error} = useAppSelector(state => state.workSession);

    const [start, setStart] =
        useState<Moment | null>(workSession ? moment.utc(workSession.start).local() : null);
    const [end, setEnd] =
        useState<Moment | null>(workSession ? moment.utc(workSession.end).local() : null);
    const [title, setTitle] = useState<string>(workSession?.title || ``);
    const [description, setDescription] = useState<string>(workSession?.description || ``);

    const [isRequireChange, setIsRequireChange] = useState<boolean>(true);

    function handleUpdate() {
        if (workSession && start?.isValid() && ((workSession.end && end?.isValid()) || !workSession.end)) {
            start.set("seconds", 0);
            end?.set("seconds", 0);
            dispatch(updateWorkSessionActionCreator({
                id: workSession.id,
                userId: workSession.userId,
                start: start.toISOString(),
                end: end?.toISOString(),
                type: workSession.type,
                title,
                description
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
            aria-describedby="work-session-update-dialog"
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
                    <Typography variant="h5">Work session record update</Typography>
                    <CloseIcon
                        sx={{cursor: "pointer"}}
                        onClick={() => navigate(-1)}
                    />
                </Box>
            </DialogTitle>
            <Divider sx={{mb: 2}}/>
            {
                workSession && workSession.userId === user.id ?
                    (
                        <>
                            <DialogContent>
                                <DialogContentText>
                                    You can update work session here
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
                                    />
                                    {workSession.end &&
                                    <DateTimePicker
                                        label="Session end date"
                                        ampm={false}
                                        value={end}
                                        onChange={(newValue) => {
                                            setIsRequireChange(false);
                                            setEnd(newValue);
                                        }}
                                    />}

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
                                    Update
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
                    ) :
                    (
                        <Alert severity="error" sx={{m: 2}}>You have no access for this work session</Alert>
                    )
            }
        </Dialog>
    );
}

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});