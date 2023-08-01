import DialogTitle from "@mui/material/DialogTitle";
import {Alert, Box, Button, TextField, Link as MuiLink, Select, MenuItem} from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import * as React from "react";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {useEffect, useState} from "react";
import {DatePicker} from "@mui/x-date-pickers";
import moment, {Moment} from "moment";
import {Holiday} from "../../models/Holiday";

const EmptyHolidayValue: Holiday = {
    id: "",
    title: "",
    type: "Holiday",
    date: "",
    endDate: ""
}
export default function HolidaysDialog() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const {user} = useAppSelector(state => state.user);
    const {holidays, error} = useAppSelector(state => state.scheduler);

    const [year, setYear] = useState<Moment | null>(moment());
    const [month, setMonth] = useState<Moment | null>(null);
    const [holidayList, setHolidayList] = useState<Holiday[]>(holidays);
    const [activeHoliday, setActiveHoliday] = useState<Holiday>(EmptyHolidayValue);

    useEffect(() => {
        setHolidayList(holidays.filter(holiday => {
            if (year) {
                if (month) {
                    if (moment(holiday.date).isSame(month, "month")) {
                        return holiday;
                    }
                }
                else {
                    if (moment(holiday.date).isSame(year, "year")) {
                        return holiday;
                    }
                }
            }
            else {
                return holiday
            }
        }));
    }, [year, month]);

    function handleConfirm() {
        if (activeHoliday.id) {
            //update
        }
        else {
            //create
        }
    }

    return (
        <Dialog
            open={true}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => navigate(-1)}
            aria-describedby="work-session-update-dialog"
            maxWidth="lg"
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
                    <Typography variant="h5">Holidays menu</Typography>
                    <CloseIcon
                        sx={{cursor: "pointer"}}
                        onClick={() => navigate(-1)}
                    />
                </Box>
            </DialogTitle>
            <Divider sx={{mb: 2}}/>
            {
                error ? (<Alert severity="error" sx={{m: 2}}>{error}</Alert>) :
                    user.id /*&& permission check */ ? (
                            <>
                                <DialogContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "80px"
                                        }}
                                    >
                                        <Box>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    width: 1
                                                }}
                                            >
                                                <DatePicker
                                                    views={['year']}
                                                    label="Year"
                                                    value={year}
                                                    onChange={(newYear) => setYear(newYear)}
                                                    slotProps={{
                                                        textField: {
                                                            sx: {
                                                                m: 2
                                                            }
                                                        }
                                                    }}
                                                />
                                                <DatePicker
                                                    views={['month']}
                                                    label="Month"
                                                    value={month}
                                                    onChange={(newMonth) => setMonth(newMonth)}
                                                    disabled={!year}
                                                />
                                            </Box>
                                            <Typography
                                                sx={{
                                                    cursor: "pointer",
                                                    mx: 2,
                                                    display: "inline"
                                                }}
                                                onClick={() => {
                                                    setYear(null);
                                                    setMonth(null);
                                                }}
                                            >
                                                <MuiLink>
                                                    Clear filters
                                                </MuiLink>
                                            </Typography>
                                            <Typography
                                                sx={{
                                                    mx: 2,
                                                    mt: 2
                                                }}
                                            >
                                                Select holiday to edit
                                            </Typography>
                                            <Box
                                                sx={{
                                                    maxHeight: "400px",
                                                    overflow: "auto",
                                                    mx: 2,
                                                    mb: 2,
                                                    width: 1,
                                                    border: "1px solid black",
                                                    borderRadius: "6px",
                                                }}
                                            >
                                                {
                                                    holidayList.length > 0 ? (
                                                        <List sx={{
                                                            width: 1
                                                        }}>
                                                            {
                                                                holidayList.map(holiday => (
                                                                    <ListItem key={holiday.id} disablePadding>
                                                                        <ListItemButton
                                                                            onClick={() => setActiveHoliday(holiday)}
                                                                        >
                                                                            <ListItemText>
                                                                                <Typography>
                                                                                    {holiday.title}
                                                                                </Typography>
                                                                                <Typography sx={{color: 'text.secondary'}}>
                                                                                    {holiday.type}
                                                                                </Typography>
                                                                                <Typography>
                                                                                    {holiday.date}
                                                                                    {holiday.endDate && ` - ${holiday.endDate}`}
                                                                                </Typography>
                                                                            </ListItemText>
                                                                        </ListItemButton>
                                                                    </ListItem>
                                                                ))
                                                            }
                                                        </List>
                                                    ) : (
                                                        <Alert severity="info">
                                                            The list of holidays with current filters is empty
                                                        </Alert>
                                                    )
                                                }
                                            </Box>
                                        </Box>
                                        <Box>
                                            <Typography variant="h4" gutterBottom>
                                                {activeHoliday.id ? "Update" : "Add"} holiday
                                            </Typography>
                                            <TextField
                                                label="Title"
                                                required
                                                variant="outlined"
                                                color="secondary"
                                                type="text"
                                                sx={{mb: 3}}
                                                fullWidth
                                                value={activeHoliday.title}
                                                onChange={(e) => setActiveHoliday({
                                                    ...activeHoliday,
                                                    title: e.target.value
                                                })}
                                            />
                                            <Select
                                                value={activeHoliday.type}
                                                fullWidth
                                                required
                                                sx={{mb: 3}}
                                                onChange={(e) => {
                                                    if (e.target.value === "DayOff" ||
                                                        e.target.value === "Holiday" ||
                                                        e.target.value === "ShortDay") {
                                                        setActiveHoliday({
                                                            ...activeHoliday,
                                                            type: e.target.value
                                                        })
                                                    }
                                                }}
                                            >
                                                <MenuItem value="DayOff">Day off</MenuItem>
                                                <MenuItem value="Holiday">Holiday</MenuItem>
                                                <MenuItem value="ShortDay">Shortened day</MenuItem>
                                            </Select>
                                            <DatePicker
                                                views={["year", "month", "day"]}
                                                label="Date"
                                                value={moment(activeHoliday.date)}
                                                sx={{width: 1, mb: 3}}
                                                onChange={(newDate) => setActiveHoliday({
                                                    ...activeHoliday,
                                                    date: newDate ? newDate.toISOString() : ""
                                                })}
                                            />
                                            <DatePicker
                                                label="End date"
                                                value={moment(activeHoliday.endDate)}
                                                sx={{width: 1, mb: 3}}
                                                slotProps={{
                                                    textField: {
                                                        error: false
                                                    },
                                                }}
                                                onChange={(newDate) => setActiveHoliday({
                                                    ...activeHoliday,
                                                    endDate: newDate ? newDate.toISOString() : undefined
                                                })}
                                            />
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "flex-end"
                                                }}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    type="submit"
                                                    size="large"
                                                >
                                                    {activeHoliday.id ? "Update" : "Add"}
                                                </Button>
                                                <Typography
                                                    sx={{
                                                        cursor: "pointer",
                                                        mx: 2,
                                                        display: "inline"
                                                    }}
                                                    onClick={() => setActiveHoliday(EmptyHolidayValue)}
                                                >
                                                    <MuiLink>
                                                        Clear form
                                                    </MuiLink>
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Box>
                                </DialogContent>
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