import {Box, Button, Grid} from "@mui/material";

import React from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch} from "../../redux/CustomHooks";
import {logoutActionCreator} from "../../redux/epics/UserEpics";
import {UserSliceState} from "../../redux/slices/UserSlice";

interface LogoutFormProps {
    userData: UserSliceState
}
export default function LogoutForm({userData}: LogoutFormProps) {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    function handleLogout() {
        dispatch(logoutActionCreator());
        navigate('/user/login')
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '80vh' }}
        >
            <Grid item xs={3}>
                <div>
                    <Box
                        sx={{
                            color: 'primary',
                            fontFamily: 'default',
                            fontSize: 20,
                            mb: 3,
                            textAlign: "center"
                        }}
                    >
                        Are you sure that you want to log out?
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between"
                        }}
                    >
                        <Link to="/">
                            <Button
                                variant="outlined"
                                color="secondary"
                                type="submit"
                                size='large'
                                sx={{
                                    mx: 2
                                }}
                            >
                                Go back
                            </Button>
                        </Link>

                        <Button
                            variant="outlined"
                            color="primary"
                            type="submit"
                            size='large'
                            sx={{
                                mx: 2
                            }}
                            onClick={handleLogout}
                        >
                            Log out
                        </Button>

                        {userData.isLoading ? <div className="lds-dual-ring"></div> : "" }
                    </Box>
                </div>
            </Grid>
        </Grid>
    );
}