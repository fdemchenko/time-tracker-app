import DialogWindow from "../layout/DialogWindow";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {hasPermit, PermissionsEnum} from "../../helpers/hasPermit";
import AccessDenied from "../AccessDenied";
import {SickLeaveInput} from "../../models/sick-leave/SickLeaveInput";
import {useNavigate, useParams} from "react-router-dom";
import * as Yup from "yup";
import moment from "moment";
import {useFormik} from "formik";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import * as React from "react";
import {DatePicker} from "@mui/x-date-pickers";
import {Alert, Autocomplete, Box, Button, TextField} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import Profile from "../../models/Profile";
import {useEffect, useState} from "react";
import {getProfilesActionCreator} from "../../redux/epics/UserEpics";
import {createSickLeaveDataActionCreator, updateSickLeaveDataActionCreator} from "../../redux/epics/SickLeaveEpics";

interface SickLeaveFormDialogProps {
    isUpdate?: boolean
}
export default function SickLeaveFormDialog({isUpdate = false}: SickLeaveFormDialogProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {id} = useParams();

    const {user} = useAppSelector(state => state.user);
    const profiles = useAppSelector(state => state.profile.profiles.items)
        .filter(profile => profile.id !== user.id);
    const curSickLeave = useAppSelector(state => state.sickLeave.sickLeaveList)
        .find(sickLeaveData => sickLeaveData.sickLeave.id === id);

    const initialProfile = getInitialProfile();

    const [userInput, setUserInput] = useState<Profile | null>(initialProfile);
    const [userTextInput, setUserTextInput] = useState<string>(initialProfile ? initialProfile.fullName : "");

    useEffect(() => {
        dispatch(getProfilesActionCreator({}));
    }, []);

    function getInitialSickLeaveValue(): SickLeaveInput {
        if (curSickLeave && isUpdate) {
            return {
                userId: curSickLeave.sickLeave.userId,
                lastModifierId: curSickLeave.sickLeave.lastModifierId,
                start: curSickLeave.sickLeave.start,
                end: curSickLeave.sickLeave.end
            }
        }
        return {
            userId: "",
            lastModifierId: "",
            start: "",
            end: ""
        }
    }

    function getInitialProfile(): Profile | null {
        if (curSickLeave && isUpdate) {
            let searchedProfile = profiles.find(profile => profile.id == curSickLeave.sickLeave.userId);
            return searchedProfile ? searchedProfile : null;
        }
        return null;
    }

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
            sickLeave: getInitialSickLeaveValue()
        },
        validationSchema,
        onSubmit: values => {
            let sickLeave = values.sickLeave;
            sickLeave.lastModifierId = user.id;
            if (isUpdate && id) {
                dispatch(updateSickLeaveDataActionCreator({
                    id: id,
                    sickLeaveInput: sickLeave
                }))
            }
            else {
                dispatch(createSickLeaveDataActionCreator(sickLeave));
            }
            navigate(-1);
        }
    });

    return (
        <DialogWindow title={`${isUpdate? "Update" : "Create"} sick leave record`}>
            {
                !hasPermit(user.permissions, PermissionsEnum[PermissionsEnum.ManageSickLeaves]) ? (
                    <AccessDenied />
                ) :
                isUpdate && !curSickLeave ? (
                        <Alert severity="error" sx={{m: 2}}>
                            Unable to find the sick leave record you are looking for
                        </Alert>
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
                                isOptionEqualToValue={(option, value) => option.id === value.id}
                                options={profiles}
                                renderInput={(params) => <TextField
                                    {...params}
                                    label="Select user"
                                    error={!!formik.errors.sickLeave?.userId}
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
                            disabled={!formik.dirty}
                        >
                            {isUpdate ? "Update" : "Create"}
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