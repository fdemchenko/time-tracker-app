import React, {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {
    Alert,
    Box,
    Button,
    FormControl, Grid,
    InputLabel, MenuItem,
    Paper, Select, SelectChangeEvent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    ToggleButton, ToggleButtonGroup
} from "@mui/material";
import {Link, Outlet, useNavigate} from "react-router-dom";
import {getVacationInfoByUserIdActionCreator, getVacationsByUserIdActionCreator} from "../../redux/epics/VacationEpics";
import {Vacation} from "../../models/vacation/Vacation";
import {GetAvailableVacationDays} from "../../services/VacationService";
import {formatIsoDateWithoutTime} from "../../helpers/date";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import {UserStatusEnum} from "../../helpers/hasPermit";

export default  function VacationList() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {vacationList, vacationInfo, error, isLoading, requireUpdateToggle} = useAppSelector(state => state.vacation);
    const {user} = useAppSelector(state => state.user);

    const [orderByDesc, setOrderByDesc] = useState<boolean>(true);
    const [vacationType, setVacationType] = useState<boolean | null>(null);

    let vacationDaysAvailable = vacationInfo ? GetAvailableVacationDays(vacationInfo.employmentDate) : 0;
    let vacationDaysLeft = vacationInfo && vacationInfo.daysSpent <= vacationDaysAvailable ?
        vacationDaysAvailable - vacationInfo.daysSpent : 0;

    let doesUserHasWorkingStatus = user.status === UserStatusEnum[UserStatusEnum.working];

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

    function getVacationStatus(vacation: Vacation): string {
        if (vacation.isApproved === null) {
            return "waiting for approve";
        }
        return vacation ? "approved" : "declined";
    }

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
                                        User vacation info
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
                                                disabled={!doesUserHasWorkingStatus}
                                            >
                                                Create new vacation request
                                            </Button>
                                            {
                                                !doesUserHasWorkingStatus &&
                                                <Typography sx={{color: 'text.secondary'}}>
                                                    Can't create vacation request while you are not currently working
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
                                >
                                    <ToggleButton value="asc" key="asc">
                                        Oldest first
                                    </ToggleButton>
                                    <ToggleButton value="desc" key="desc">
                                        Newest first
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Box>

                            {vacationList.length > 0
                                ?
                                <>
                                    <TableContainer sx={{ mt: 2 }} className="custom-table-container" component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell style={{fontWeight: 'bold'}}>Start</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>End</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>Comment</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>Approver</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>Approver comment</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}>Status</TableCell>
                                                    <TableCell style={{fontWeight: 'bold'}}></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {vacationList.map((vacationItem) => (
                                                    <TableRow style={{backgroundColor: vacationItem.vacation.isApproved === null ? '#9e9e9e' :
                                                            vacationItem.vacation.isApproved ? '#6fbf73' : '#ffa733'}}
                                                              key={vacationItem.vacation.id}>
                                                        <TableCell>
                                                            {formatIsoDateWithoutTime(vacationItem.vacation.start)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatIsoDateWithoutTime(vacationItem.vacation.end)}
                                                        </TableCell>
                                                        <TableCell sx={{maxWidth: "150px"}}>
                                                            <Tooltip title={vacationItem.vacation.comment}>
                                                                <Box sx={{
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}>
                                                                    {vacationItem.vacation.comment || "missing"}
                                                                </Box>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>
                                                            {
                                                                vacationItem.approver ?
                                                                    (
                                                                        <Link to={`/user/${vacationItem.approver.id}`}>
                                                                            {vacationItem.approver.fullName}
                                                                        </Link>
                                                                    ) : "none"
                                                            }
                                                        </TableCell>
                                                        <TableCell sx={{maxWidth: "150px"}}>
                                                            <Tooltip title={vacationItem.vacation.approverComment}>
                                                                <Box sx={{
                                                                    whiteSpace: 'nowrap',
                                                                    overflow: 'hidden',
                                                                    textOverflow: 'ellipsis'
                                                                }}>
                                                                    {
                                                                        vacationItem.vacation.approverComment || "missing"
                                                                    }
                                                                </Box>
                                                            </Tooltip>
                                                        </TableCell>
                                                        <TableCell>{getVacationStatus(vacationItem.vacation)}</TableCell>
                                                        <TableCell>
                                                            {
                                                                vacationItem.vacation.isApproved === null &&
                                                                <Link to={`/vacations/delete/${vacationItem.vacation.id}`}>
                                                                    <DeleteIcon />
                                                                </Link>
                                                            }
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </>
                                :
                                <Alert severity="info" sx={{ mt: 2 }}>
                                    There is no vacations to be found
                                </Alert>
                            }
                        </>
                    }
                </>
            }
        </>

    );
};