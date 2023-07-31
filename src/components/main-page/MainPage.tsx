import {UserSliceState} from "../../redux/slices/UserSlice";
import React from "react";
import {Alert} from "@mui/material";

interface MainPageProps {
    userData: UserSliceState
}
export default function MainPage({userData}: MainPageProps) {
    return (
        <div>
            Hello, {userData.user.fullName}!

            {userData.error ? <Alert severity="error" sx={{mt: 2}}>{userData.error}</Alert> : "" }
        </div>
    );
}