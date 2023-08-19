import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import React, {useEffect} from "react";
import {getSickLeaveDataActionCreator} from "../../redux/epics/SickLeaveEpics";
import moment from "moment";
import {
    Alert,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Outlet} from "react-router-dom";
import SickLeaveList from "./SickLeaveList";

export default function SickLeavePage() {
    const dispatch = useAppDispatch();

    const {error, isLoading} = useAppSelector(state => state.sickLeave);
    const {user} = useAppSelector(state => state.user);

    useEffect(() => {
        dispatch(getSickLeaveDataActionCreator({
            userId: user.id,
            date: moment(),
            searchByYear: false
        }))
    }, []);

    return (
        <>
            {error
                ? <Alert severity="error" sx={{mt: 2}}>{error}</Alert>
                : <>
                    {isLoading
                        ? <div className="lds-dual-ring"></div>
                        :
                        <>
                            <Typography variant="h3" gutterBottom>
                                Sick leave list
                            </Typography>

                            <Outlet />

                            <SickLeaveList />
                        </>
                    }
                </>
            }
        </>
    );
}