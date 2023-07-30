import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Scheduler} from "@aldabil/react-scheduler";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {useEffect, useRef} from "react";
import {
    deleteWorkSessionActionCreator,
    getUserWorkSessionsActionCreator,
    updateWorkSessionActionCreator
} from "../../redux/epics/WorkSessionEpics";
import {formatIsoTime, parseIsoDateToLocal, separateDateOnMidnight} from "../../helpers/date";
import {EventActions, ProcessedEvent, SchedulerRef} from "@aldabil/react-scheduler/types";
import {SetGlobalMessage} from "../../redux/slices/GlobalMessageSlice";

export default function TrackerScheduler() {
    const {workSessionsList, requireUpdateToggle, isLoading} = useAppSelector(state => state.workSession);
    const {user} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const schedulerRef = useRef<SchedulerRef>(null);

    useEffect(() => {
        //need to change on the same dispatch but without offset, limit and filterDate parameters
        dispatch(getUserWorkSessionsActionCreator({
            userId: user.id,
            orderByDesc: true,
            offset: 0,
            limit: 9999999,
            filterDate: null
        }));
    }, []);

    useEffect(() => {
        if (schedulerRef.current) {
            //map workSessionsList to ProcessedEvent[]
            let events: ProcessedEvent[] = [];

            workSessionsList.items.map(ws => {
                if (ws.end) {
                    let startLocal = parseIsoDateToLocal(ws.start);
                    let endLocal = parseIsoDateToLocal(ws.end);
                    //function to separate date on multiple dates if event is crossing midnight
                    let timePassed = separateDateOnMidnight(startLocal, endLocal);
                    timePassed.map(timePassesDay => {
                        events.push({
                            event_id: ws.id,
                            user_id: ws.userId,
                            title: "Work",
                            start: new Date(timePassesDay.start),
                            end: new Date(timePassesDay.end),
                            description: "Some random description",
                            allDay: false
                        });
                    });
                }
            });

            schedulerRef.current.scheduler.handleState(events, "events")
        }
    }, [requireUpdateToggle]);

    async function handleDelete(deletedId: string) {
        dispatch(deleteWorkSessionActionCreator(deletedId));
    }

    async function handleConfirm(
        event: ProcessedEvent,
        action: EventActions
    ): Promise<ProcessedEvent> {
        //mb we need to make resolve to close update dialog
        //or we can use some method in chedulerRef.current.scheduler...
        return new Promise(() => {
            if (!isNaN(event.start.getTime()) && !isNaN(event.end.getTime())) {
                if (action === "edit") {
                    dispatch(updateWorkSessionActionCreator({
                        id: typeof event.event_id == "string" ? event.event_id : "",
                        userId: event.user_id,
                        type: "planned",
                        start: event.start.toISOString(),
                        end: event.end.toISOString()
                    }))
                } else if (action === "create") {
                    //dispatch to create work session
                    /**POST event to remote DB */
                }
            }
            else {
                dispatch(SetGlobalMessage({
                    title: "Validation Error",
                    message: "Date is invalid",
                    type: "warning"
                }));
            }
        });
    }

    return (
        <Box>
            <Typography variant="h2" gutterBottom>
                Work sessions
            </Typography>
            <Scheduler
                //custom scheduler fields
                fields={[
                    {
                        name: "comment",
                        type: "input",
                        config: {
                            label: "Comment",
                            required: false,
                            multiline: true,
                            rows: 4
                        }
                    },
                    {
                        name: "user_id",
                        type: "hidden"
                    }
                ]}
                ref={schedulerRef}
                loading={isLoading}
                onDelete={handleDelete}
                onConfirm={handleConfirm}
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

                eventRenderer={({event, ...props}) => (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            gap: "5px",
                            height: "100%",
                            background: "#222E50",
                            padding: "10px",
                            textOverflow: "ellipsis",
                        }}
                        {...props}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                textTransform: "uppercase",
                                color: "#FCCB06"
                            }}
                        >
                            {event.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#edf7f6",
                                fontWeight: "bold"
                            }}
                        >
                            {
                                formatIsoTime(event.start.toISOString()) + "-" +
                                formatIsoTime(event.end.toISOString())
                            }
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: "#edf7f6"
                            }}
                        >
                            {event.description}
                        </Typography>
                    </Box>
                )
                }
            />
        </Box>
    );
}
