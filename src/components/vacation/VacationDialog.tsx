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
import {DateTimePicker} from "@mui/x-date-pickers";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import moment, {Moment} from "moment";
import {createWorkSessionActionCreator} from "../../redux/epics/WorkSessionEpics";
import {SetGlobalMessage} from "../../redux/slices/GlobalMessageSlice";

interface VacationDialogProps {
    type: "create" | "details" | "update"
}
export default function VacationDialog({type}: VacationDialogProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {user} = useAppSelector(state => state.user);
    const {error} = useAppSelector(state => state.vacation);

    const [start, setStart] = useState<Moment | null>(moment().local());
    const [end, setEnd] = useState<Moment | null>(moment().local());
    const [comment, setComment] = useState<string | null>(null);

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
                                //fields
                            </Box>
                            {
                                error && <Alert severity="error" sx={{m: 2}}>{error}</Alert>
                            }
                        </DialogContent>
                        <DialogActions sx={{mx: 3, my: 2}}>
                            <Button
                                size="large"
                                //onClick={handleUpdate}
                                //disabled={isRequireChange}
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
                    </>
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