import * as React from "react";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import DialogTitle from "@mui/material/DialogTitle";
import {Alert, Box, Button, MenuItem, Select, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {DatePicker, DateTimePicker} from "@mui/x-date-pickers";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import * as Yup from "yup";
import {VacationCreate} from "../../models/vacation/VacationCreate";
import {useFormik} from "formik";
import {createVacationActionCreator} from "../../redux/epics/VacationEpics";

interface VacationDialogProps {
    type: "create" | "details" | "update"
}
const InitialVacationValue: VacationCreate = {
    userId: "",
    start: "",
    end: "",
    comment: ""
};
export default function VacationDialog({type}: VacationDialogProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {user} = useAppSelector(state => state.user);
    const {error} = useAppSelector(state => state.vacation);

    const validationSchema = Yup.object().shape({
        vacation: Yup.object().shape({
            userId: Yup.string(),
            start: Yup.string().required("Start date is required"),
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
        }
    });

    return (
        <Dialog
            open={true}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => navigate(-1)}
            aria-describedby="vacation-create-dialog"
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
                    <Typography variant="h5">Create vacation request</Typography>
                    <CloseIcon
                        sx={{cursor: "pointer"}}
                        onClick={() => navigate(-1)}
                    />
                </Box>
            </DialogTitle>
            <Divider sx={{mb: 2}}/>
            {
                (
                    <form onSubmit={formik.handleSubmit}>
                        <DialogContent>
                            <DialogContentText>
                                You can create vacation request here
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
                                <DatePicker
                                    views={["year", "month", "day"]}
                                    label="Start date"
                                    format="YYYY-MM-DD"
                                    sx={{width: 1, mb: 3}}
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
                                    sx={{width: 1, mb: 3}}
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
                                    sx={{mb: 3}}
                                    fullWidth
                                    multiline
                                    error={formik.touched.vacation?.comment && !!formik.errors.vacation?.comment}
                                    helperText={formik.touched.vacation?.comment && formik.errors.vacation?.comment}
                                    {...formik.getFieldProps('vacation.comment')}
                                />
                            </Box>
                            {
                                error && <Alert severity="error" sx={{m: 2}}>{error}</Alert>
                            }
                        </DialogContent>
                        <DialogActions sx={{mx: 3, my: 2}}>
                            <Button
                                size="large"
                                type="submit"
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