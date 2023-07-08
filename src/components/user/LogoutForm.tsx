import {Alert, Box, Button, TextField} from "@mui/material";

import React, {useEffect} from "react";
import {Link, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {logoutActionCreator} from "../../redux/epics/UserEpics";

export default function LogoutForm() {
    const {isLogged} = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const navigation = useNavigate();

    //not working for some reason
    // if (isLogged) {
    //     navigation("/user/login");
    // }

    function handleLogout() {
        dispatch(logoutActionCreator());
    }

    return (
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
            </Box>
        </div>
    );
}