import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Scheduler} from "@aldabil/react-scheduler";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {useEffect} from "react";
import {getUserWorkSessionsActionCreator} from "../../redux/epics/WorkSessionEpics";

export default function TrackerScheduler() {
    const {workSessionsList} = useAppSelector(state => state.workSession);
    const {user} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (workSessionsList.items.length == 0) {
            dispatch(getUserWorkSessionsActionCreator({
                userId: user.id,
                orderByDesc: true,
                offset: 0,
                limit: 9999999,
                filterDate: null
            }));
        }
    }, []);


    return (
        <Box>
            <Typography variant="h2" gutterBottom>
                Work sessions
            </Typography>
            <Scheduler
                events={workSessionsList.items.filter(ws => ws.end).map(ws => {
                    return {
                        event_id: ws.id,
                        title: "Work session",
                        start: new Date(ws.start),
                        end: ws.end ? new Date(ws.end) : new Date()
                    }
                })}
                hourFormat="24"
                week={{
                    weekDays: [0, 1, 2, 3, 4, 5, 6],
                    weekStartOn: 1,
                    startHour: 0,
                    endHour: 24,
                    step: 60,
                    navigation: true,
                    disableGoToDay: false
                }}
            />
        </Box>
    );
}
