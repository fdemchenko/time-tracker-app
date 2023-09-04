import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {hasPermit, PermissionsEnum} from "../../helpers/hasPermit";
import AccessDenied from "../AccessDenied";
import {Link, Outlet} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {
    Alert, ToggleButton, ToggleButtonGroup
} from "@mui/material";
import Typography from "@mui/material/Typography";
import VacationList from "./VacationList";
import PreviewIcon from '@mui/icons-material/Preview';
import {getVacationRequestsActionCreator} from "../../redux/epics/VacationEpics";

export default function ApproveVacation() {
    const dispatch = useAppDispatch();

    const {vacationList, error, isLoading, requireUpdateToggle} = useAppSelector(state => state.vacation);
    const {user} = useAppSelector(state => state.user);

    const [getNotStarted, setGetNotStarted] = useState<boolean>(false);

    let canApproveVacations = hasPermit(user.permissions, PermissionsEnum[PermissionsEnum.ApproveVacations]);

    useEffect(() => {
        if (canApproveVacations) {
            dispatch(getVacationRequestsActionCreator(getNotStarted));
        }
    }, [getNotStarted, requireUpdateToggle]);

    function handleGetNotStartedChange(event: React.MouseEvent<HTMLElement>,
                                       newValue: string | null) {
        if (newValue) {
            setGetNotStarted(newValue !== "waiting");
        }
    }

    if (!canApproveVacations) {
        return (<AccessDenied />);
    }

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
                                Vacation request
                            </Typography>

                            <Outlet />

                            <ToggleButtonGroup
                              value={getNotStarted ? "answered" : "waiting"}
                              exclusive
                              onChange={handleGetNotStartedChange}
                              aria-label="view mode"
                              color="primary"
                              size="small"
                            >
                                <ToggleButton value="waiting" aria-label="waiting">
                                    Show waiting for approve vacations
                                </ToggleButton>
                                <ToggleButton value="answered" aria-label="answered">
                                    Show recently answered vacations
                                </ToggleButton>
                            </ToggleButtonGroup>

                            <VacationList
                                vacationList={vacationList}
                                actionsCellRenderer={(vacation) =>
                                    <>
                                        {
                                            (getNotStarted || vacation.isApproved === null) &&
                                            <Link to={`/vacations/approvement/${vacation.id}`}>
                                                <PreviewIcon />
                                            </Link>
                                        }
                                    </>
                                }
                                showUser
                            />
                        </>
                    }
                </>
            }
        </>
    );
}