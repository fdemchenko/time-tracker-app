import {UserSliceState} from "../../redux/slices/UserSlice";
import {Alert, Button} from "@mui/material";
import {useAppDispatch} from "../../redux/CustomHooks";
import {getUsersActionCreator} from "../../redux/epics/UserEpics";
import React from "react";

interface MainPageProps {
    userData: UserSliceState
}
export default function MainPage({userData}: MainPageProps) {
    const dispatch = useAppDispatch();

    function handleGetUsers() {
        dispatch(getUsersActionCreator());
    }

    return (
        <div>
            Hello, {userData.user.fullName}!
            <Button onClick={handleGetUsers}>Get Users in console</Button>
            {userData.error ? <Alert severity="error" sx={{mt: 2}}>{userData.error}</Alert> : "" }
        </div>
    );
}