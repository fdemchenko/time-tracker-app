import React, {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {
    Alert,
    Box,
    Button,
    FormControl, Grid,
    InputLabel, MenuItem,
    Paper, Select, SelectChangeEvent,
    ToggleButton, ToggleButtonGroup
} from "@mui/material";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {getVacationInfoByUserIdActionCreator, getVacationsByUserIdActionCreator} from "../../redux/epics/VacationEpics";
import {GetAvailableVacationDays} from "../../services/VacationService";
import Typography from "@mui/material/Typography";
import VacationList from "./VacationList";
import DeleteIcon from "@mui/icons-material/Delete";
import moment from "moment";

export default  function UserVacations() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {vacationList, vacationInfo, error, isLoading, requireUpdateToggle} = useAppSelector(state => state.vacation);
    const {user} = useAppSelector(state => state.user);

    const [orderByDesc, setOrderByDesc] = useState<boolean>(true);
    const [vacationType, setVacationType] = useState<boolean | null>(null);

    let vacationDaysAvailable = vacationInfo ? GetAvailableVacationDays(vacationInfo.employmentDate) : 0;
    let vacationDaysLeft = vacationInfo && vacationInfo.daysSpent <= vacationDaysAvailable ?
        vacationDaysAvailable - vacationInfo.daysSpent : 0;

    let doesUserHaveVacation = !!vacationList.find(v => v.vacation.isApproved !== false &&
      moment().isSameOrBefore(v.vacation.start, "days"));

    useEffect(() => {
        dispatch(getVacationsByUserIdActionCreator({
            userId: user.id,
            onlyApproved: vacationType,
            orderByDesc: orderByDesc
        }));
    }, [orderByDesc, vacationType, requireUpdateToggle]);

    useEffect(() => {
        dispatch(getVacationInfoByUserIdActionCreator(user.id));
    }, []);

    function handleOrderChange(e: React.MouseEvent<HTMLElement>, value: string) {
        if (value === "asc") {
            setOrderByDesc(false);
        }
        else if(value === "desc") {
            setOrderByDesc(true);
        }
    }

    function handleVacationStatusChange(e: SelectChangeEvent) {
        let value = e.target.value;
        if (value === "approved") {
            setVacationType(true);
        }
        else if (value === "declined") {
            setVacationType(false);
        }
        else if (value === "all") {
            setVacationType(null);
        }
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
                                List of vacations
                            </Typography>

                            <Outlet />

                            {
                                vacationInfo &&
                                <>
                                    <Typography variant="h4" gutterBottom>
                                        Vacation info
                                    </Typography>
                                    <Grid container sx={{mb: 3}}>
                                        <Grid item xs={8}>
                                            <Box
                                                sx={{
                                                    pb: 2,
                                                    display: 'grid',
                                                    gridTemplateColumns: { md: '1fr 1fr 1fr' },
                                                    gap: 2,
                                                    textAlign: "center"
                                                }}
                                            >
                                                <Paper elevation={6} sx={{p: 2}}>
                                                    <b>{vacationDaysAvailable}</b> vacation days available
                                                </Paper>
                                                <Paper elevation={6} sx={{p: 2}}>
                                                    <b>{vacationInfo.daysSpent}</b> vacation days spent
                                                </Paper>
                                                <Paper elevation={6} sx={{p: 2}}>
                                                    <b>
                                                        {
                                                            vacationDaysLeft === 0 ? "less than 0" : vacationDaysLeft
                                                        }
                                                    </b> vacation days left
                                                </Paper>
                                            </Box>
                                            <Button
                                                onClick={() => navigate('/vacations/create')}
                                                variant="outlined"
                                                color="success"
                                                size="medium"
                                                disabled={doesUserHaveVacation}
                                            >
                                                Create new vacation request
                                            </Button>
                                            {
                                                doesUserHaveVacation &&
                                                <Typography sx={{color: 'text.secondary'}}>
                                                    You already have an active vacation request
                                                </Typography>
                                            }
                                        </Grid>
                                    </Grid>
                                </>
                            }

                            <Box sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "25px"
                            }}>
                                <FormControl fullWidth sx={{maxWidth: "200px"}}>
                                    <InputLabel id="vacation_status">Vacation status</InputLabel>
                                    <Select
                                        labelId="vacation_status"
                                        id="vacation_status_select"
                                        value={vacationType === null ? "all" : vacationType ? "approved" : "declined"}
                                        label="Vacation status"
                                        onChange={handleVacationStatusChange}
                                    >
                                        <MenuItem value="all">All</MenuItem>
                                        <MenuItem value="approved">Approved</MenuItem>
                                        <MenuItem value="declined">Declined</MenuItem>
                                    </Select>
                                </FormControl>

                                <ToggleButtonGroup
                                    value={orderByDesc ? "desc" : "asc"}
                                    onChange={handleOrderChange}
                                    exclusive={true}
                                    color="primary"
                                >
                                    <ToggleButton value="asc" key="asc">
                                        Oldest first
                                    </ToggleButton>
                                    <ToggleButton value="desc" key="desc">
                                        Newest first
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            <VacationList
                                vacationList={vacationList}
                                actionsCellRenderer={(vacation) =>
                                    <>
                                        {
                                            vacation.isApproved === null &&
                                            <Link to={`/vacations/delete/${vacation.id}`}>
                                                <DeleteIcon />
                                            </Link>
                                        }
                                    </>
                                }
                            />
                        </>
                    }
                </>
            }
        </>
    );
};