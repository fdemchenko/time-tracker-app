import Typography from "@mui/material/Typography";
import {Box, Button} from "@mui/material";
import {useEffect, useState} from "react";
import {WorkSessionSliceState} from "../../redux/slices/WorkSessionSlice";
import * as React from "react";
import {useAppDispatch} from "../../redux/CustomHooks";
import {createWorkSessionActionCreator, setEndWorkSessionActionCreator} from "../../redux/epics/WorkSessionEpics";

interface TrackerProps {
    workSessionData: WorkSessionSliceState,
    userId: string
    handleSetTrackerDisplay: (value: string) => void
}
export default function Tracker({workSessionData, userId, handleSetTrackerDisplay}: TrackerProps) {
    const dispatch = useAppDispatch();

    const [startTime, setStartTime] = useState(Date.now());
    const [now, setNow] = useState(startTime);
    const [intervalID, setIntervalID] = useState<NodeJS.Timer>();
    const trackerDisplay = new Date(now - startTime).toISOString().slice(11, 19);

    useEffect(() => {
        if (workSessionData.activeWorkSession) {
            setNow(Date.now());
            setStartTime(new Date(workSessionData.activeWorkSession.start).getTime());
            setIntervalID(setInterval(() => setNow(Date.now()), 1000));
        }
    }, [workSessionData.activeWorkSession]);

    useEffect(() => {
        handleSetTrackerDisplay(trackerDisplay);
    }, [trackerDisplay]);

    const start = () => {
        if (workSessionData.activeWorkSession == null) {
            setNow(Date.now());
            setStartTime(now);

            dispatch(createWorkSessionActionCreator(userId));
        }
    };

    const stop = () => {
        if (workSessionData.activeWorkSession) {
            clearInterval(intervalID);
            setIntervalID(undefined);
            setNow(Date.now());
            setStartTime(now);

            dispatch(setEndWorkSessionActionCreator(workSessionData.activeWorkSession.id));
        }
    };

    return (
        <div>
            <Typography variant="h3">
                <span>{trackerDisplay}</span>
            </Typography>
            <Typography variant="h6" color="darkgrey">
                {intervalID ? 'Running' : 'Not running'}
            </Typography>
            <Box sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                mt: "10px",
                gap: "10px"
            }}>
                <Button
                    variant="contained"
                    color="success"
                    size="large"
                    onClick={start}
                    sx={{w: 1}}
                    disabled={intervalID !== undefined}
                >
                    Start
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    size="large"
                    onClick={stop}
                    disabled={intervalID === undefined}
                >
                    Finish
                </Button>
            </Box>
        </div>
    );
};