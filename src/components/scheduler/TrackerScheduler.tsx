import {Alert, Box, Button} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Scheduler} from "@aldabil/react-scheduler";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import React, {useEffect, useRef, useState} from "react";
import {
    createWorkSessionActionCreator,
    deleteWorkSessionActionCreator,
    getUserWorkSessionsActionCreator,
    updateWorkSessionActionCreator
} from "../../redux/epics/WorkSessionEpics";
import {formatIsoTime, parseIsoDateToLocal, separateDateOnMidnight} from "../../helpers/date";
import {DayHours, EventActions, ProcessedEvent, SchedulerRef} from "@aldabil/react-scheduler/types";
import {SetGlobalMessage} from "../../redux/slices/GlobalMessageSlice";
import {getHolidaysActionCreator} from "../../redux/epics/SchedulerEpics";
import {Link, Outlet, useNavigate, useParams} from "react-router-dom";
import moment from "moment/moment";
import {hasPermit} from "../../helpers/hasPermit";
import {TimePicker} from "@mui/x-date-pickers";
import {Moment} from "moment";

export default function TrackerScheduler() {
    const {workSessionsList, requireUpdateToggle, isLoading} = useAppSelector(state => state.workSession);
    const {holidays} = useAppSelector(state => state.scheduler);

    const {id} = useParams()

    const {user} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const [startRange, setStartRange] = useState<number>(8);
    const [endRange, setEndRange] = useState<number>(20);

    const schedulerRef = useRef<SchedulerRef>(null);

    useEffect(() => {
        if (id) {
            dispatch(getUserWorkSessionsActionCreator({
                userId: id,
                orderByDesc: true,
            }));

            dispatch(getHolidaysActionCreator());
        }
    }, []);

    useEffect(() => {
        if (schedulerRef.current) {
            let events: ProcessedEvent[] = [];

            workSessionsList.items.map(ws => {
                if (ws.end) {
                    let startLocal = parseIsoDateToLocal(ws.start);
                    let endLocal = parseIsoDateToLocal(ws.end);

                    let timePassed = separateDateOnMidnight(startLocal, endLocal);
                    timePassed.map(timePassesDay => {
                        events.push({
                            event_id: ws.id,
                            user_id: ws.userId,
                            title: ws.title || "Work",
                            type: ws.type,
                            lastModifierName: ws.lastModifierName,
                            start: new Date(timePassesDay.start),
                            end: new Date(timePassesDay.end),
                            description: ws.description || "",
                            allDay: false
                        });
                    });
                }
            });

            holidays.map(holiday => {
                events.push({
                    event_id: holiday.id,
                    title: holiday.title,
                    description: holiday.type,
                    start: moment(holiday.date).toDate(),
                    end: holiday.endDate ? moment(holiday.endDate).add(1,"minute").toDate() : moment(holiday.date).toDate(),
                    allDay: true,
                    editable: false,
                    deletable: false,
                    draggable: false
                });
            });

            schedulerRef.current.scheduler.handleState(events, "events")
        }
    }, [requireUpdateToggle, holidays]);

    async function handleDelete(deletedId: string) {
        dispatch(deleteWorkSessionActionCreator(deletedId));
    }

    async function handleConfirm(
        event: ProcessedEvent,
        action: EventActions
    ): Promise<ProcessedEvent> {
        return new Promise(() => {
            if (!isNaN(event.start.getTime()) && !isNaN(event.end.getTime()) && id) {
                if (action === "edit" && (id === user.id || hasPermit(user.permissions, "UpdateWorkSessions"))) {
                    dispatch(updateWorkSessionActionCreator({
                        id: typeof event.event_id == "string" ? event.event_id : "",
                        userId: event.user_id,
                        type: event.type,
                        start: event.start.toISOString(),
                        end: event.end.toISOString(),
                        title: event.title,
                        description: event.description,
                        lastModifierId: user.id,
                        lastModifierName: user.fullName,
                    }));

                } else if (action === "create" && (id === user.id || hasPermit(user.permissions, "CreateWorkSessions"))) {
                    dispatch(createWorkSessionActionCreator({
                        Type: "planned",
                        UserId: id,
                        Description: event.description,
                        Title: event.title,
                        Start: event.start.toISOString(),
                        End: event.end.toISOString(),
                    }));
                }

            } else {
                dispatch(SetGlobalMessage({
                    title: "Validation Error",
                    message: "Date or user is invalid",
                    type: "warning"
                }));
            }
        });
    }

    return (
        <Box>
            {!id
              ?
              <Alert severity="error" sx={{ mt: 2 }}>
                  User not found
              </Alert>
            :
            <>
            <Typography variant="h2" gutterBottom>
                Work sessions
            </Typography>

            {hasPermit(user.permissions, "ManageHolidays") &&
                <Link to="/holidays">
                    <Button
                        sx={{mb: 2}}
                        size="large"
                        variant="contained"
                    >
                        Manage holidays
                    </Button>
                </Link>
            }

            <Box
                sx={{
                    my: 3,
                    display: "flex",
                    alignItems: "center",
                    gap: "15px"
                }}
            >
                <TimePicker
                    label="Scheduler start"
                    ampm={false}
                    views={["hours"]}
                    slotProps={{
                        textField: {
                            size: "small",
                            sx: {
                                width: "130px"
                            }
                        }
                    }}
                    value={moment().set("hours", startRange)}
                    onChange={(newValue) => newValue && setStartRange(newValue.hours())}
                />
                <TimePicker
                    label="Scheduler end"
                    ampm={false}
                    views={["hours"]}
                    slotProps={{
                        textField: {
                            size: "small",
                            sx: {
                                width: "130px"
                            }
                        }
                    }}
                    minTime={moment().set("hours", startRange + 1)}
                    value={moment().set("hours", endRange)}
                    onChange={(newValue) => newValue && setEndRange(newValue.hours())}
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
                    },
                    {
                        name: "user_id",
                        type: "hidden"
                    },
                    {
                        name: "type",
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
                    startHour: startRange as DayHours,
                    endHour: endRange as DayHours,
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
                            background: `${event.type === 'planned' ? '#33126e' : '#1e8c1c'}`,
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
                        <Typography
                          variant="body2"
                          sx={{
                              color: "#edf7f6"
                          }}
                        >
                            {event.lastModifierName}
                        </Typography>
                    </Box>
                )
                }
            />
            </>}
        </Box>
    );
}
