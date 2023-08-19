import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import React, {useEffect, useState} from "react";
import {getSickLeaveDataActionCreator} from "../../redux/epics/SickLeaveEpics";
import moment, {Moment} from "moment";
import {
    Alert,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Outlet} from "react-router-dom";
import SickLeaveList from "./SickLeaveList";
import SickLeaveListFilters from "./SickLeaveListFilters";
import Profile from "../../models/Profile";

export default function SickLeavePage() {
    const dispatch = useAppDispatch();

    const {error, isLoading} = useAppSelector(state => state.sickLeave);

    const [filterUser, setFilterUser] = useState<Profile | null>(null);
    const [searchByYear, setSearchByYear] = useState<boolean>(false);
    const [filterDate, setFilterDate] = useState<Moment>(moment());

    useEffect(() => {
        dispatch(getSickLeaveDataActionCreator({
            userId: filterUser ? filterUser.id : null,
            date: filterDate,
            searchByYear: searchByYear
        }))
    }, [filterUser, searchByYear, filterDate]);

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

                            <SickLeaveListFilters
                                filterUser={filterUser}
                                setFilterUser={setFilterUser}
                                searchByYear={searchByYear}
                                setSearchByYear={setSearchByYear}
                                filterDate={filterDate}
                                setFilterDate={setFilterDate}
                            />
                            <SickLeaveList />
                        </>
                    }
                </>
            }
        </>
    );
}