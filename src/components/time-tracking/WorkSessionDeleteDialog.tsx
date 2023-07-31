import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Box, Button} from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from '@mui/icons-material/Close';
import Divider from "@mui/material/Divider";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {deleteWorkSessionActionCreator} from "../../redux/epics/WorkSessionEpics";

export default function WorkSessionDeleteDialog() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {id} = useParams();

    const workSession = useAppSelector(state =>
        state.workSession.workSessionsList.items.find(ws => ws.id === id));
    const {user} = useAppSelector(state => state.user);

    function handleDelete() {
        if (workSession) {
            dispatch(deleteWorkSessionActionCreator(workSession.id));
            navigate(-1);
        }
    }

    return (
        <Dialog
            open={true}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => navigate(-1)}
            aria-describedby="work-session-update-dialog"
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
                    <Typography variant="h5">Work session record delete</Typography>
                    <CloseIcon
                        sx={{cursor: "pointer"}}
                        onClick={() => navigate(-1)}
                    />
                </Box>
            </DialogTitle>
            <Divider sx={{mb: 2}}/>
            {
                workSession && workSession.userId === user.id ?
                    (
                        <>
                            <DialogContent>
                                <DialogContentText fontSize={18}>
                                    Are you sure that you want to delete this work session?
                                    You can't get it back later.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions sx={{mx: 3, my: 2}}>
                                <Button
                                    size="large"
                                    onClick={handleDelete}
                                >
                                    Yes, i am sure. Delete it!
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