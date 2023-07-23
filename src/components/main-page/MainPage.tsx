import {UserSliceState} from "../../redux/slices/UserSlice";
import {useAppDispatch} from "../../redux/CustomHooks";
import React from "react";
import {useNavigate} from "react-router-dom";
import {hasPermit} from "../../helpers/hasPermit";
import Typography from "@mui/material/Typography";
import {Alert, Button} from "@mui/material";

interface MainPageProps {
    userData: UserSliceState
}
export default function MainPage({userData}: MainPageProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    return (
        <div>
            Hello, {userData.user.fullName}!

            {hasPermit(userData.user.permissions, "GetUsers") &&
              <Button onClick={() => navigate('/users')}>Get Users in console</Button>
            }
            {userData.error ? <Alert severity="error" sx={{mt: 2}}>{userData.error}</Alert> : "" }
        </div>
    );
}