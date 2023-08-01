import DialogTitle from "@mui/material/DialogTitle";
import {Alert, Box, Button, TextField, Link as MuiLink, Select, MenuItem, Popover} from "@mui/material";
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
import {
    createHolidayActionCreator,
    deleteHolidayActionCreator,
    updateHolidayActionCreator
} from "../../redux/epics/SchedulerEpics";
import {useFormik} from "formik";
import * as Yup from "yup";
import {SetGlobalMessage} from "../../redux/slices/GlobalMessageSlice";

const InitialHolidayValue: Holiday = {
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

    const [anchorConfirmDelete, setAnchorConfirmDelete] = React.useState<HTMLButtonElement | null>(null);
    const handleOpenConfirmWindow = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorConfirmDelete(event.currentTarget);
    };
    const handleCloseConfirmWindow = () => {
        setAnchorConfirmDelete(null);
    };
    const openConfirm = Boolean(anchorConfirmDelete);
    const confirmId = openConfirm ? 'confirm-popover' : undefined;

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
    }, [year, month, holidays]);

    const validationSchema = Yup.object().shape({
        holiday: Yup.object().shape({
            id: Yup.string(),
            title: Yup.string().required("Title is required").min(6, "Title should be longer than 6"),
            type: Yup.string().oneOf(["DayOff", "Holiday", "ShortDay"], "Select holiday type"),
            date: Yup.string().required("Holiday date is required"),
            endDate: Yup.string()
        })
    });
    const formik = useFormik({
        initialValues: {
            holiday: InitialHolidayValue
        },
        validationSchema,
        onSubmit: values => {
            const holiday = values.holiday;
            if (holiday.id) {
                dispatch(updateHolidayActionCreator(holiday));
            }
            else {
                dispatch(createHolidayActionCreator(holiday));
            }
            formik.setValues({holiday: InitialHolidayValue});
            formik.setTouched({}, false);
        }
    });

    function handleConfirmDelete() {
        dispatch(deleteHolidayActionCreator(formik.values.holiday.id));
        formik.setValues({holiday: InitialHolidayValue});
        formik.setTouched({}, false);
        handleCloseConfirmWindow();
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
                                    <form onSubmit={formik.handleSubmit}>
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
                                                                                onClick={() => formik.setFieldValue("holiday", holiday)}
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
                                                    {formik.values.holiday.id ? "Update" : "Add"} holiday
                                                </Typography>
                                                <TextField
                                                    label="Title"
                                                    variant="outlined"
                                                    color="secondary"
                                                    type="text"
                                                    sx={{mb: 3}}
                                                    fullWidth
                                                    error={formik.touched.holiday?.title && !!formik.errors.holiday?.title}
                                                    helperText={formik.touched.holiday?.title && formik.errors.holiday?.title}
                                                    {...formik.getFieldProps('holiday.title')}
                                                />
                                                <Select
                                                    fullWidth
                                                    sx={{mb: 3}}
                                                    error={formik.touched.holiday?.type && !!formik.errors.holiday?.type}
                                                    {...formik.getFieldProps('holiday.type')}
                                                >
                                                    <MenuItem value="DayOff">Day off</MenuItem>
                                                    <MenuItem value="Holiday">Holiday</MenuItem>
                                                    <MenuItem value="ShortDay">Shortened day</MenuItem>
                                                </Select>
                                                <DatePicker
                                                    views={["year", "month", "day"]}
                                                    label="Date"
                                                    sx={{width: 1, mb: 3}}
                                                    value={moment(formik.values.holiday.date)}
                                                    onChange={(newDate) => formik.setFieldValue("holiday.date",
                                                        newDate ? newDate.toISOString() : undefined, true)}
                                                    slotProps={{
                                                        textField: {
                                                            error: !!formik.errors.holiday?.date,
                                                            helperText: formik.touched.holiday?.date && formik.errors.holiday?.date
                                                        }
                                                    }}
                                                />
                                                <DatePicker
                                                    label="End date"
                                                    sx={{width: 1, mb: 3}}
                                                    value={moment(formik.values.holiday.endDate)}
                                                    onChange={(newDate) => formik.setFieldValue("holiday.endDate",
                                                        newDate ? newDate.toISOString() : undefined, true)}
                                                    slotProps={{
                                                        textField: {
                                                            error: false,
                                                            helperText: formik.touched.holiday?.endDate && formik.errors.holiday?.endDate
                                                        }
                                                    }}
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
                                                        {formik.values.holiday.id ? "Update" : "Add"}
                                                    </Button>
                                                    {
                                                        formik.values.holiday.id &&
                                                        <Box>
                                                            <Button
                                                                aria-describedby={confirmId}
                                                                variant="outlined"
                                                                color="error"
                                                                size="large"
                                                                sx={{
                                                                    ml: 2
                                                                }}
                                                                onClick={handleOpenConfirmWindow}
                                                            >
                                                                Delete
                                                            </Button>
                                                            <Popover
                                                                id={confirmId}
                                                                open={openConfirm}
                                                                anchorEl={anchorConfirmDelete}
                                                                onClose={handleCloseConfirmWindow}
                                                                anchorOrigin={{
                                                                    vertical: 'bottom',
                                                                    horizontal: 'left',
                                                                }}
                                                            >
                                                                <Typography sx={{ p: 2 }}>
                                                                    Please, confirm delete operation
                                                                </Typography>
                                                                <Button
                                                                    variant="outlined"
                                                                    color="error"
                                                                    size="large"
                                                                    sx={{
                                                                        m: 2
                                                                    }}
                                                                    onClick={handleConfirmDelete}
                                                                >
                                                                    Confirm
                                                                </Button>
                                                            </Popover>
                                                        </Box>
                                                    }
                                                    <Typography
                                                        sx={{
                                                            cursor: "pointer",
                                                            mx: 2,
                                                            display: "inline"
                                                        }}
                                                        onClick={() => {
                                                            formik.setFieldValue("holiday", InitialHolidayValue);
                                                            formik.setTouched({}, true);
                                                        }}
                                                    >
                                                        <MuiLink>
                                                            Clear form
                                                        </MuiLink>
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    </form>
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