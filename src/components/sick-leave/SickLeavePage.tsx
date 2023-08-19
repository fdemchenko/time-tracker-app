import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import React, {useEffect, useState} from "react";
import {getSickLeaveDataActionCreator} from "../../redux/epics/SickLeaveEpics";
import moment, {Moment} from "moment";
import {
    Alert, Button,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Outlet, useNavigate} from "react-router-dom";
import SickLeaveList from "./SickLeaveList";
import SickLeaveListFilters from "./SickLeaveListFilters";
import Profile from "../../models/Profile";
import {hasPermit, PermissionsEnum} from "../../helpers/hasPermit";

export default function SickLeavePage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {error, isLoading, requireUpdateToggle} = useAppSelector(state => state.sickLeave);
    const {user} = useAppSelector(state => state.user);

    const [filterUser, setFilterUser] = useState<Profile | null>(null);
    const [searchByYear, setSearchByYear] = useState<boolean>(false);
    const [filterDate, setFilterDate] = useState<Moment>(moment());

    useEffect(() => {
        dispatch(getSickLeaveDataActionCreator({
            userId: filterUser ? filterUser.id : null,
            date: filterDate,
            searchByYear: searchByYear
        }))
    }, [filterUser, searchByYear, filterDate, requireUpdateToggle]);

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

                            {
                                hasPermit(user.permissions, PermissionsEnum[PermissionsEnum.ManageSickLeaves]) &&
                                <Button
                                    onClick={() => navigate('/sick-leave/create')}
                                    variant="outlined"
                                    color="success"
                                    size="medium"
                                    sx={{mb: 2}}
                                >
                                    Create new sick leave record
                                </Button>
                            }

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