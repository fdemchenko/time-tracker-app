import {UserSliceState} from "../../redux/slices/UserSlice";
import {useAppDispatch} from "../../redux/CustomHooks";
import React from "react";
import Typography from "@mui/material/Typography";

interface MainPageProps {
    userData: UserSliceState
}
export default function MainPage({userData}: MainPageProps) {
    const dispatch = useAppDispatch();

    return (
        <Typography sx={{
            textAlign: "left"
        }}>
            Hello, {userData.user.fullName}!<br /><br />
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad aliquam, autem cumque cupiditate dolor ex, in iure iusto laboriosam magnam, molestias odio odit quibusdam reprehenderit sed sunt tempora voluptate voluptatum?
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat magnam nesciunt quidem quo velit. Dolores ducimus laboriosam laudantium, nam, nulla perferendis quas quod quos reprehenderit tempore tenetur, vel veniam voluptatem.
        </Typography>
    );
}