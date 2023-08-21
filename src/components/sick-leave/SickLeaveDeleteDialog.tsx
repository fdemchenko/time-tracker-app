import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import DialogActions from "@mui/material/DialogActions";
import {Alert, Button} from "@mui/material";
import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogWindow from "../layout/DialogWindow";
import {hasPermit, PermissionsEnum} from "../../helpers/hasPermit";
import AccessDenied from "../AccessDenied";
import {deleteSickLeaveDataActionCreator} from "../../redux/epics/SickLeaveEpics";

export default function SickLeaveDeleteDialog() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {id} = useParams();

    const {user} = useAppSelector(state => state.user);
    const sickLeaveData = useAppSelector(state => state.sickLeave.sickLeaveList
        ).find(sl => sl.sickLeave.id === id);

    function handleDelete() {
        if (sickLeaveData && id) {
            dispatch(deleteSickLeaveDataActionCreator(id));
            navigate(-1);
        }
    }

    return (
        <DialogWindow title="Delete sick leave record">
            {
                !hasPermit(user.permissions, PermissionsEnum[PermissionsEnum.ManageSickLeaves]) ? (
                        <AccessDenied />
                    ) :
                !sickLeaveData || !id ? (
                    <Alert severity="error" sx={{m: 2}}>
                        Unable to find the sick leave record you are looking for
                    </Alert>
                ) : (
                    <>
                        <DialogContent>
                            <DialogContentText fontSize={18}>
                                Are you sure that you want to delete this sick leave record?
                                You can't get it back later.
                            </DialogContentText>
                        </DialogContent>

                        <DialogActions sx={{mx: 3, my: 2}}>
                            <Button
                                size="large"
                                color="error"
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                            <Button
                                size="large"
                                color="secondary"
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </Button>
                        </DialogActions>
                    </>
                )
            }
        </DialogWindow>
    );
}