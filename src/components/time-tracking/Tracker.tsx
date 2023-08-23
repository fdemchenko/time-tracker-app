import Typography from "@mui/material/Typography";
import {Alert, Box, Button} from "@mui/material";
import {useEffect, useState} from "react";
import * as React from "react";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {
    createWorkSessionActionCreator,
    getActiveWorkSessionActionCreator,
    setEndWorkSessionActionCreator
} from "../../redux/epics/WorkSessionEpics";
import {isoDateToNumber, parseIsoDateToLocal} from "../../helpers/date";
import moment from "moment/moment";
import {WorkSessionTypesEnum} from "../../helpers/workSessionHelper";

interface TrackerProps {
    handleSetTrackerDisplay: (value: string) => void
}
export default function Tracker({handleSetTrackerDisplay}: TrackerProps) {
    const user = useAppSelector(state => state.user.user);
    const workSessionData = useAppSelector(state => state.workSession);
    const dispatch = useAppDispatch();

    const [startTime, setStartTime] = useState(Date.now());
    const [now, setNow] = useState(startTime);
    const [intervalID, setIntervalID] = useState<NodeJS.Timer>();
    const trackerDisplay = intervalID ? new Date(now - startTime).toISOString().slice(11, 19) : "00:00:00";

    useEffect(() => {
        dispatch(getActiveWorkSessionActionCreator(user.id));
    }, [user.id]);

    useEffect(() => {
        if (workSessionData.activeWorkSession) {
            setNow(Date.now());
            setStartTime(isoDateToNumber(parseIsoDateToLocal(workSessionData.activeWorkSession.start)));
            setIntervalID(setInterval(() => setNow(Date.now()), 500));
        }
    }, [workSessionData.activeWorkSession]);

    useEffect(() => {
        handleSetTrackerDisplay(trackerDisplay);
    }, [trackerDisplay]);

    const start = () => {
        console.log("start")
        if (workSessionData.activeWorkSession == null) {
            console.log("in if start")
            setNow(Date.now());
            setStartTime(now);

            dispatch(createWorkSessionActionCreator({
                userId: user.id,
                start: moment().toISOString(),
                end: null,
                type: WorkSessionTypesEnum[WorkSessionTypesEnum.Active],
                description: null,
                title: null,
                lastModifierId: user.id
            }));
        }
    };

    const stop = () => {
        if (workSessionData.activeWorkSession) {
            clearInterval(intervalID);
            setIntervalID(undefined);
            setNow(Date.now());
            setStartTime(now);

            dispatch(setEndWorkSessionActionCreator(workSessionData.activeWorkSession.id, moment()));
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
                    disabled={!!(workSessionData.error || intervalID !== undefined)}
                >
                    Start
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    size="large"
                    onClick={stop}
                    disabled={!!(workSessionData.error || intervalID === undefined)}
                >
                    Finish
                </Button>
            </Box>

            {workSessionData.error && <Alert severity="error" sx={{m: 2}}>{workSessionData.error}</Alert>}
        </div>
    );
};