import {UserSliceState} from "../../redux/slices/UserSlice";
import {Alert, Box, Button} from "@mui/material";
import {useAppDispatch} from "../../redux/CustomHooks";
import {getUsersActionCreator} from "../../redux/epics/UserEpics";
import React from "react";
import Typography from "@mui/material/Typography";

interface MainPageProps {
    userData: UserSliceState
}
export default function MainPage({userData}: MainPageProps) {
    const dispatch = useAppDispatch();

    function handleGetUsers() {
        dispatch(getUsersActionCreator());
    }

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%"
            }}
        >
            <Box
                sx={{
                    width: "70%"
                }}
            >
                <Typography sx={{
                    textAlign: "left"
                }}>
                    Hello, {userData.user.fullName}!
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, autem cumque cupiditate dolor ex, in iure iusto laboriosam magnam, molestias odio odit quibusdam reprehenderit sed sunt tempora voluptate voluptatum?
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat magnam nesciunt quidem quo velit. Dolores ducimus laboriosam laudantium, nam, nulla perferendis quas quod quos reprehenderit tempore tenetur, vel veniam voluptatem.
                </Typography>
            </Box>
            <Box
                sx={{
                    width: "20%",
                    backgroundColor: "dodgerblue"
                }}
            >
                Timer here
            </Box>
        </Box>
    );
}