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
import {DatePicker} from "@mui/x-date-pickers";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {useNavigate, useParams} from "react-router-dom";
import moment from "moment";
import * as Yup from "yup";
import {VacationCreate} from "../../models/vacation/VacationCreate";
import {useFormik} from "formik";
import {createVacationActionCreator, deleteVacationActionCreator} from "../../redux/epics/VacationEpics";
import AccessDenied from "../AccessDenied";
import {UserStatusEnum} from "../../helpers/hasPermit";

interface VacationDialogProps {
    type: "create" | "approve" | "delete"
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
    const {vacationId} = useParams();

    const {user} = useAppSelector(state => state.user);
    const {error} = useAppSelector(state => state.vacation);
    const vacationResp = useAppSelector(state => state.vacation.vacationList
        .find(vl => vl.vacation.id === vacationId));

    let doesUserHasWorkingStatus = user.status === UserStatusEnum[UserStatusEnum.working];

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

    function handleDelete() {
        if (vacationResp) {
            dispatch(deleteVacationActionCreator(vacationResp.vacation.id));
            navigate(-1);
        }
    }

    function isCreateMode(): boolean {
        return type === "create";
    }

    function isDeleteMode(): boolean {
        return type === "delete";
    }

    let actionButtons = (
        <DialogActions sx={{mx: 3, my: 2}}>
            <Button
                size="large"
                type={isDeleteMode() ? "button" : "submit"}
                color={isDeleteMode() ? "error" : "primary"}
                onClick={isDeleteMode() ? handleDelete : undefined}
            >
                {isCreateMode() ? "Create" : isDeleteMode() ? "Delete" : "Update"}
            </Button>
            <Button
                size="large"
                color="secondary"
                onClick={() => navigate(-1)}
            >
                Back
            </Button>
        </DialogActions>
    );

    return (
        <Dialog
            open={true}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => navigate(-1)}
            aria-describedby="vacation-create-dialog"
            fullWidth
            maxWidth="xs"
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
                    <Typography variant="h5">
                        {isCreateMode() ? "Create" : isDeleteMode() ? "Delete" : "Approve"} vacation request
                    </Typography>
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
                        {
                            !doesUserHasWorkingStatus ? (
                                    <Alert severity="error" sx={{m: 2}}>
                                        Can't create vacation request while you are not currently working
                                    </Alert>
                                ) :
                                isDeleteMode() ?
                                    !vacationResp ? (
                                        <Alert severity="error" sx={{m: 2}}>
                                            Unable to find the vacation request you are looking for
                                        </Alert>
                                    ) : vacationResp.vacation.isApproved === null ?
                                        <>
                                            <DialogContent>
                                                <DialogContentText fontSize={18}>
                                                    Are you sure that you want to delete this vacation request?
                                                    You can't get it back later.
                                                </DialogContentText>
                                            </DialogContent>
                                            {actionButtons}
                                        </>
                                        : (
                                            <Alert severity="error" sx={{m: 2}}>
                                                Can not delete vacation which was updated by Approver
                                            </Alert>
                                        )
                                    : (
                                        <>
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
                                                {
                                                    error && <Alert severity="error" sx={{m: 2}}>{error}</Alert>
                                                }
                                            </DialogContent>
                                            {actionButtons}
                                        </>
                                    )
                        }
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