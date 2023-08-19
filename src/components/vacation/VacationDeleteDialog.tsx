import {useNavigate, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {deleteVacationActionCreator} from "../../redux/epics/VacationEpics";
import DialogActions from "@mui/material/DialogActions";
import {Alert, Button} from "@mui/material";
import * as React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import {useEffect} from "react";

interface VacationDeleteDialogProps {
    setTitle: (title: string) => void
}
export default function VacationDeleteDialog({setTitle}: VacationDeleteDialogProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {vacationId} = useParams();

    const vacationResp = useAppSelector(state => state.vacation.vacationList
        .find(vl => vl.vacation.id === vacationId));

    useEffect(() => {
        setTitle("Delete vacation request");
    }, []);

    function handleDelete() {
        if (vacationResp) {
            dispatch(deleteVacationActionCreator(vacationResp.vacation.id));
            navigate(-1);
        }
    }

    return (
        <>
            {
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
                    : (
                        <Alert severity="error" sx={{m: 2}}>
                            Can not delete vacation which was updated by Approver
                        </Alert>
                    )
            }
        </>
    );
}