import * as React from "react";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import DialogTitle from "@mui/material/DialogTitle";
import {Alert, Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import {useAppSelector} from "../../redux/CustomHooks";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import VacationCreateDialog from "./VacationCreateDialog";
import VacationDeleteDialog from "./VacationDeleteDialog";
import VacationApproveDialog from "./VacationApproveDialog";

interface VacationDialogProps {
    type: "create" | "approve" | "delete"
}
export default function VacationDialog({type}: VacationDialogProps) {
    const navigate = useNavigate();

    const {error} = useAppSelector(state => state.vacation);

    const [title, setTitle] = useState<string>("");

    return (
        <Dialog
            open={true}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => navigate(-1)}
            aria-describedby="vacation-dialog"
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
                        {title}
                    </Typography>
                    <CloseIcon
                        sx={{cursor: "pointer"}}
                        onClick={() => navigate(-1)}
                    />
                </Box>
            </DialogTitle>
            <Divider sx={{mb: 2}}/>

            {
                type === "create" ? (
                    <VacationCreateDialog setTitle={setTitle} />
                ) : type === "delete" ? (
                    <VacationDeleteDialog setTitle={setTitle} />
                ) : (
                    <VacationApproveDialog setTitle={setTitle} />
                )
            }

            {
                error && <Alert severity="error" sx={{m: 2}}>{error}</Alert>
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