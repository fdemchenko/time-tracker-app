import {UserStatusEnum} from "../../helpers/hasPermit";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {VacationCreate} from "../../models/vacation/VacationCreate";
import * as Yup from "yup";
import moment from "moment/moment";
import {useFormik} from "formik";
import {createVacationActionCreator} from "../../redux/epics/VacationEpics";
import {useNavigate} from "react-router-dom";
import DialogActions from "@mui/material/DialogActions";
import {Alert, Box, Button, TextField} from "@mui/material";
import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {DatePicker} from "@mui/x-date-pickers";
import {useEffect} from "react";

const InitialVacationValue: VacationCreate = {
    userId: "",
    start: "",
    end: "",
    comment: ""
};
interface VacationCreateDialogProps {
    setTitle: (title: string) => void
}
export default function VacationCreateDialog({setTitle}: VacationCreateDialogProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {user} = useAppSelector(state => state.user);

    let doesUserHasWorkingStatus = user.status === UserStatusEnum[UserStatusEnum.working];

    useEffect(() => {
        setTitle("Create vacation request");
    }, []);

    const validationSchema = Yup.object().shape({
        vacation: Yup.object().shape({
            userId: Yup.string(),
            start: Yup.string().required("Start date is required").test("isBeforeNow",
                "Start date should be at least tomorrow", (value, context) =>
                    moment(context.parent.start).isAfter(moment(), "days")),
            end: Yup.string().required("End date is required").test("isBefore",
                "End date should be after start date", (value, context) =>
                    moment(context.parent.start).isBefore(value, "days")),
            comment: Yup.string().notRequired().nullable()
        })
    });
    const formik = useFormik({
        initialValues: {
            vacation: InitialVacationValue
        },
        validationSchema,
        onSubmit: values => {
            let vacation = values.vacation;
            vacation.userId = user.id;
            dispatch(createVacationActionCreator(vacation));
            navigate(-1);
        }
    });

    return (
        <>
            {
                !doesUserHasWorkingStatus ? (
                    <Alert severity="error" sx={{m: 2}}>
                        Can't create vacation request while you are not currently working
                    </Alert>
                ) : (
                    <form onSubmit={formik.handleSubmit}>
                        <DialogContent>
                            <DialogContentText sx={{mb: 2}}>
                                Enter vacation data
                            </DialogContentText>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: "25px"
                                }}
                            >
                                <DatePicker
                                    views={["year", "month", "day"]}
                                    label="Start date"
                                    format="YYYY-MM-DD"
                                    minDate={moment().add(1, "days")}
                                    sx={{width: 1}}
                                    value={moment(formik.values.vacation.start)}
                                    onChange={(newDate) => formik.setFieldValue("vacation.start",
                                        newDate ? newDate.toISOString() : undefined, true)}
                                    slotProps={{
                                        textField: {
                                            error: !!formik.touched.vacation?.start && !!formik.errors.vacation?.start,
                                            helperText: formik.touched.vacation?.start && formik.errors.vacation?.start
                                        }
                                    }}
                                    dayOfWeekFormatter={(day) => `${day}`}
                                />

                                <DatePicker
                                    views={["year", "month", "day"]}
                                    label="End date"
                                    format="YYYY-MM-DD"
                                    minDate={moment(formik.values.vacation.start).add(2, "days")}
                                    sx={{width: 1}}
                                    value={moment(formik.values.vacation.end)}
                                    onChange={(newDate) => formik.setFieldValue("vacation.end",
                                        newDate ? newDate.toISOString() : undefined, true)}
                                    slotProps={{
                                        textField: {
                                            error: !!formik.touched.vacation?.end && !!formik.errors.vacation?.end,
                                            helperText: formik.touched.vacation?.end && formik.errors.vacation?.end
                                        }
                                    }}
                                    dayOfWeekFormatter={(day) => `${day}`}
                                />

                                <TextField
                                    label="Optional comment"
                                    variant="outlined"
                                    color="secondary"
                                    type="text"
                                    minRows={3}
                                    sx={{mb: 3}}
                                    fullWidth
                                    multiline
                                    error={formik.touched.vacation?.comment && !!formik.errors.vacation?.comment}
                                    helperText={formik.touched.vacation?.comment && formik.errors.vacation?.comment}
                                    {...formik.getFieldProps('vacation.comment')}
                                />
                            </Box>
                        </DialogContent>

                        <DialogActions sx={{mx: 3, my: 2}}>
                            <Button
                                size="large"
                                type="submit"
                                color="primary"
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
                    </form>
                )
            }
        </>
    );
}