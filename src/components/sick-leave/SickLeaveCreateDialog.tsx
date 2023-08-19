import DialogWindow from "../layout/DialogWindow";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {hasPermit, PermissionsEnum} from "../../helpers/hasPermit";
import AccessDenied from "../AccessDenied";
import {SickLeaveInput} from "../../models/sick-leave/SickLeaveInput";
import {useNavigate} from "react-router-dom";
import * as Yup from "yup";
import moment from "moment";
import {useFormik} from "formik";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import * as React from "react";
import {DatePicker} from "@mui/x-date-pickers";
import {Autocomplete, Box, Button, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Profile from "../../models/Profile";
import {useEffect, useState} from "react";
import {getProfilesActionCreator} from "../../redux/epics/UserEpics";
import {createSickLeaveDataActionCreator} from "../../redux/epics/SickLeaveEpics";

const InitialSickLeaveValue: SickLeaveInput = {
    userId: "",
    lastModifierId: "",
    start: "",
    end: "",
};
export default function SickLeaveCreateDialog() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {user} = useAppSelector(state => state.user);
    const profiles = useAppSelector(state => state.profile.profiles.items)
        .filter(profile => profile.id !== user.id);

    const [userInput, setUserInput] = useState<Profile | null>(null);
    const [userTextInput, setUserTextInput] = useState<string>("");

    useEffect(() => {
        dispatch(getProfilesActionCreator({}));
    }, []);

    const validationSchema = Yup.object().shape({
        sickLeave: Yup.object().shape({
            userId: Yup.string().required("User is required"),
            lastModifierId: Yup.string(),
            start: Yup.string().required("Start date is required"),
            end: Yup.string().required("End date is required").test("isBefore",
                "End date should be after start date", (value, context) =>
                    moment(context.parent.start).isBefore(value, "days")),
        })
    });
    const formik = useFormik({
        initialValues: {
            sickLeave: InitialSickLeaveValue
        },
        validationSchema,
        onSubmit: values => {
            let sickLeave = values.sickLeave;
            sickLeave.lastModifierId = user.id;
            dispatch(createSickLeaveDataActionCreator(sickLeave));
            navigate(-1);
        }
    });

    return (
        <DialogWindow title="Create sick leave record">
            {
                !hasPermit(user.permissions, PermissionsEnum[PermissionsEnum.ManageSickLeaves]) ? (
                    <AccessDenied />
                ) :
                <form onSubmit={formik.handleSubmit}>
                    <DialogContent>
                        <DialogContentText sx={{mb: 2}}>
                            Enter sick leave data
                        </DialogContentText>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: "25px"
                            }}
                        >
                            <Autocomplete
                                getOptionLabel={(option: Profile) => option.fullName}
                                options={profiles}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label="Select user"
                                    error={!!formik.touched.sickLeave?.userId && !!formik.errors.sickLeave?.userId}
                                    helperText={formik.touched.sickLeave?.userId && formik.errors.sickLeave?.userId}
                                />}
                                fullWidth
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                value={userInput}
                                inputValue={userTextInput}
                                onChange={(event: any, selectedUser: Profile | null) => {
                                    setUserInput(selectedUser);
                                    formik.setFieldValue("sickLeave.userId", selectedUser?.id)
                                }}
                                onInputChange={(event, newInputValue) => {
                                    setUserTextInput(newInputValue);
                                }}
                            />

                            <DatePicker
                                views={["year", "month", "day"]}
                                label="Start date"
                                format="YYYY-MM-DD"
                                sx={{width: 1}}
                                value={moment(formik.values.sickLeave.start)}
                                onChange={(newDate) => formik.setFieldValue("sickLeave.start",
                                    newDate ? newDate.toISOString() : undefined, true)}
                                slotProps={{
                                    textField: {
                                        error: !!formik.touched.sickLeave?.start && !!formik.errors.sickLeave?.start,
                                        helperText: formik.touched.sickLeave?.start && formik.errors.sickLeave?.start
                                    }
                                }}
                                dayOfWeekFormatter={(day) => `${day}`}
                            />

                            <DatePicker
                                views={["year", "month", "day"]}
                                label="End date"
                                format="YYYY-MM-DD"
                                minDate={moment(formik.values.sickLeave.start).add(3, "days")}
                                sx={{width: 1}}
                                value={moment(formik.values.sickLeave.end)}
                                onChange={(newDate) => formik.setFieldValue("sickLeave.end",
                                    newDate ? newDate.toISOString() : undefined, true)}
                                slotProps={{
                                    textField: {
                                        error: !!formik.touched.sickLeave?.end && !!formik.errors.sickLeave?.end,
                                        helperText: formik.touched.sickLeave?.end && formik.errors.sickLeave?.end
                                    }
                                }}
                                dayOfWeekFormatter={(day) => `${day}`}
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
            }
        </DialogWindow>
    );
}