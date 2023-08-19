import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {Link, useNavigate, useParams} from "react-router-dom";
import * as Yup from "yup";
import moment from "moment";
import {useFormik} from "formik";
import {approverUpdateVacationActionCreator} from "../../redux/epics/VacationEpics";
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import {DatePicker} from "@mui/x-date-pickers";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DialogWindow from "../layout/DialogWindow";

export default function VacationApproveDialog() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {vacationId} = useParams();

    const {user} = useAppSelector(state => state.user);
    const vacationResp = useAppSelector(state => state.vacation.vacationList
        .find(vl => vl.vacation.id === vacationId));

    const validationSchema = Yup.object().shape({
        approveComment: Yup.string().notRequired().nullable(),
        isApproved: Yup.boolean().required("Approve decision is required")
    });
    const formik = useFormik({
        initialValues: {
            approveComment: vacationResp ? vacationResp.vacation.approverComment : "",
            isApproved: vacationResp ? vacationResp.vacation.isApproved : null
        },
        validationSchema,
        onSubmit: values => {
            if (vacationResp && values.isApproved !== null) {
                dispatch(approverUpdateVacationActionCreator({
                    id: vacationResp.vacation.id,
                    isApproved: values.isApproved,
                    approverId: user.id,
                    approverComment: values.approveComment
                }));
            }
            navigate(-1);
        }
    });

    function handleApproveChange(e: SelectChangeEvent) {
        let value = e.target.value;
        if (value === "none") {
            formik.setFieldValue("isApproved", null);
        }
        else if (value === "approved") {
            formik.setFieldValue("isApproved", true);
        }
        else if (value === "declined") {
            formik.setFieldValue("isApproved", false);
        }
    }

    return (
        <DialogWindow title="Approve vacation request">
            {
                !vacationResp ? (
                    <Alert severity="error" sx={{m: 2}}>
                        Unable to find the vacation request you are looking for
                    </Alert>
                ) : (
                    <form onSubmit={formik.handleSubmit}>
                        <DialogContent>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: "25px"
                                }}
                            >
                                <Typography>Vacation request data</Typography>

                                <DatePicker
                                    views={["year", "month", "day"]}
                                    label="Start date"
                                    format="YYYY-MM-DD"
                                    sx={{width: 1}}
                                    value={moment(vacationResp.vacation.start)}
                                    readOnly
                                    dayOfWeekFormatter={(day) => `${day}`}
                                />

                                <DatePicker
                                    views={["year", "month", "day"]}
                                    label="End date"
                                    format="YYYY-MM-DD"
                                    sx={{width: 1}}
                                    value={moment(vacationResp.vacation.end)}
                                    readOnly
                                    dayOfWeekFormatter={(day) => `${day}`}
                                />

                                {
                                    vacationResp.vacation.comment &&
                                    <TextField
                                        label="Optional comment"
                                        variant="outlined"
                                        color="secondary"
                                        type="text"
                                        minRows={3}
                                        fullWidth
                                        multiline
                                        value={vacationResp.vacation.comment}
                                        InputProps={{
                                            readOnly: true,
                                        }}
                                    />
                                }

                                <Box>
                                    Requested by <Link to={`/user/${vacationResp.user.id}`} target="_blank">
                                        {vacationResp.user.fullName}
                                    </Link>
                                </Box>
                            </Box>
                            <Divider sx={{my: 2}} />
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "flex-start",
                                    gap: "25px"
                                }}
                            >
                                <Typography>Update data</Typography>
                                <TextField
                                    label="Optionable approver comment"
                                    variant="outlined"
                                    color="secondary"
                                    type="text"
                                    minRows={3}
                                    fullWidth
                                    multiline
                                    error={formik.touched.approveComment && !!formik.errors.approveComment}
                                    helperText={formik.touched.approveComment && formik.errors.approveComment}
                                    {...formik.getFieldProps('approveComment')}
                                />

                                <FormControl fullWidth>
                                    <InputLabel id="vacation_approve">Vacation Approve</InputLabel>
                                    <Select
                                        labelId="vacation_status"
                                        id="vacation_status_select"
                                        value={formik.values.isApproved === null ? "none" :
                                            formik.values.isApproved ? "approved" : "declined"}
                                        label="Vacation status"
                                        onChange={handleApproveChange}
                                        error={formik.touched.isApproved && !!formik.errors.isApproved}
                                    >
                                        <MenuItem value="none">No review</MenuItem>
                                        <MenuItem value="approved">Approved</MenuItem>
                                        <MenuItem value="declined">Declined</MenuItem>
                                    </Select>
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {formik.touched.isApproved && formik.errors.isApproved}
                                    </FormHelperText>
                                </FormControl>

                                {
                                    vacationResp.approver &&
                                    <Box>
                                        Updated by <Link to={`/user/${vacationResp.approver.id}`} target="_blank">
                                            {vacationResp.approver.fullName}
                                        </Link>
                                    </Box>
                                }
                            </Box>
                        </DialogContent>

                        <DialogActions sx={{mx: 3, my: 2}}>
                            <Button
                                size="large"
                                type="submit"
                                color="primary"
                            >
                                Edit
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
        </DialogWindow>
    );
}