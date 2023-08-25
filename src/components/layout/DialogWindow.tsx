import * as React from "react";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import DialogTitle from "@mui/material/DialogTitle";
import {Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import {useNavigate} from "react-router-dom";
import {ReactNode} from "react";

interface DialogWindowProps {
    title: string,
    children: ReactNode,
    handleClose?: () => void
}

export default function DialogWindow({title, children, handleClose}: DialogWindowProps) {
    const navigate = useNavigate();

    return (
        <Dialog
            open={true}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose ? handleClose : () => navigate(-1)}
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
                        onClick={handleClose ? handleClose : () => navigate(-1)}
                    />
                </Box>
            </DialogTitle>
            <Divider sx={{mb: 2}}/>

            {children}
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