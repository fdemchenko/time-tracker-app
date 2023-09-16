import * as React from 'react';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Button} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {deleteWorkSessionActionCreator} from "../../redux/epics/WorkSessionEpics";
import {hasPermit, PermissionsEnum} from "../../helpers/hasPermit";
import AccessDenied from "../AccessDenied";
import DialogWindow from "../layout/DialogWindow";

export default function WorkSessionDeleteDialog() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {workSessionId} = useParams();

    const {workSessionsList} = useAppSelector(state => state.workSession);
    const {user} = useAppSelector(state => state.user);
    const curWorkSession = workSessionsList.items.find(ws => ws.id === workSessionId);

    function handleDelete() {
        if (workSessionId && curWorkSession) {
            dispatch(deleteWorkSessionActionCreator(workSessionId));
            navigate(-1);
        }
    }

    return (
      <DialogWindow title="Delete work session">
          {
              !hasPermit(user.permissions, PermissionsEnum[PermissionsEnum.DeleteWorkSessions])
              && curWorkSession?.userId !== user.id ?
                (<AccessDenied/>)
                : !curWorkSession ? (
                    <Alert severity="error" sx={{m: 2}}>Can not find this work session</Alert>
                  ) :
                  (
                    <>
                        <DialogContent>
                            <DialogContentText fontSize={18}>
                                Are you sure that you want to delete this work session record?
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