import DialogTitle from "@mui/material/DialogTitle";
import {Alert, Box, Button, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Divider from "@mui/material/Divider";
import DialogContent from "@mui/material/DialogContent";
import Dialog from "@mui/material/Dialog";
import * as React from "react";
import {TransitionProps} from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import {useNavigate} from "react-router-dom";
import {useAppSelector} from "../../redux/CustomHooks";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import {TypeSpecimen} from "@mui/icons-material";

export default function HolidaysDialog() {
    const navigate = useNavigate();

    const {user} = useAppSelector(state => state.user);
    const {holidays, error} = useAppSelector(state => state.scheduler);

    return (
        <Dialog
            open={true}
            TransitionComponent={Transition}
            keepMounted
            onClose={() => navigate(-1)}
            aria-describedby="work-session-update-dialog"
            maxWidth="xl"
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
                    <Typography variant="h5">Holidays menu</Typography>
                    <CloseIcon
                        sx={{cursor: "pointer"}}
                        onClick={() => navigate(-1)}
                    />
                </Box>
            </DialogTitle>
            <Divider sx={{mb: 2}}/>
            {
                error ? (<Alert severity="error" sx={{m: 2}}>{error}</Alert>) :
                    user.id /*&& permission check */ ? (
                            <>
                                <DialogContent>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "50px"
                                        }}
                                    >
                                        <Box>
                                            <TextField
                                                label="Year"
                                                type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                style={{width: "20%"}}
                                                sx={{
                                                    m: "15px 0 15px 15px"
                                                }}
                                            />
                                            <TextField
                                                label="Month"
                                                type="number"
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                style={{width: "50%"}}
                                                sx={{
                                                    m: "15px 0 15px 15px"
                                                }}
                                            />
                                            <Box
                                                sx={{
                                                    maxWidth: "350px",
                                                    maxHeight: "400px",
                                                    overflow: "auto",
                                                    px: 2,
                                                }}
                                            >

                                                <List sx={{
                                                    border: "1px solid black",
                                                    borderRadius: "6px"
                                                }}>
                                                    {
                                                        holidays.map(holiday => (
                                                            <ListItem disablePadding>
                                                                <ListItemButton>
                                                                    <ListItemText>
                                                                        <Typography>
                                                                            {holiday.title}
                                                                        </Typography>
                                                                        <Typography sx={{color: 'text.secondary'}}>
                                                                            {holiday.type}
                                                                        </Typography>
                                                                        <Typography>
                                                                            {holiday.date}
                                                                            {holiday.endDate && ` - ${holiday.endDate}`}
                                                                        </Typography>
                                                                    </ListItemText>
                                                                </ListItemButton>
                                                            </ListItem>
                                                        ))
                                                    }
                                                </List>
                                            </Box>
                                        </Box>
                                        <Box>
                                            <React.Fragment>
                                                <form autoComplete="off">
                                                    <h2>Login Form</h2>
                                                    <TextField
                                                        label="Email"
                                                        required
                                                        variant="outlined"
                                                        color="secondary"
                                                        type="email"
                                                        sx={{mb: 3}}
                                                        fullWidth
                                                    />
                                                    <TextField
                                                        label="Password"
                                                        required
                                                        variant="outlined"
                                                        color="secondary"
                                                        type="password"
                                                        fullWidth
                                                        sx={{mb: 3}}
                                                    />
                                                    <Button variant="outlined" color="secondary" type="submit">Login</Button>
                                                </form>
                                            </React.Fragment>
                                        </Box>
                                    </Box>
                                </DialogContent>
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