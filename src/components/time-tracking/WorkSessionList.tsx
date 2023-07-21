import React, {useState, useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {
    Alert,
    Box,
    Button,
    FormControl, Grid, InputAdornment,
    InputLabel, MenuItem,
    Pagination,
    Paper, Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@mui/material";
import {FilterAltOutlined} from '@mui/icons-material';
import {useNavigate} from "react-router-dom";
import {getUserWorkSessionsActionCreator} from "../../redux/epics/WorkSessionEpics";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from "moment";

export default function WorkSessionList() {
    const dispatch = useAppDispatch();
    const {workSessionsList, error, isLoading,
        activeWorkSession} = useAppSelector(state => state.workSession);
    const {user} = useAppSelector(state => state.user);

    const workSessionLimit: number = 8;

    const [page, setPage] = useState<number>(1);

    const pagesCount: number = Math.ceil(workSessionsList.length / workSessionLimit);

    const [filterDate, setFilterDate] = useState<Date | null>(null);
    const [orderByDesc, setOrderByDesc] = useState<boolean>(false);

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };

    useEffect(() => {
        // dispatch(getUsersActionCreator({
        //     Offset: page * usersOnPageLimit - usersOnPageLimit,
        //     Limit: usersOnPageLimit,
        //     SortingColumn: sortBy,
        //     Search: fullName,
        //     FilteringEmploymentRate: employmentRate,
        //     FilteringStatus: status,
        // }));
        dispatch(getUserWorkSessionsActionCreator(user.id));
    }, [page, filterDate, orderByDesc, activeWorkSession]);

    return (
        <>
            {error
                ? <Alert severity="error" sx={{mt: 2}}>{error}</Alert>
                : <>
                    {isLoading
                        ? <div className="lds-dual-ring"></div>
                        :
                        <>
                            <h3 style={{marginBottom: '10px'}}>
                                List of work session
                            </h3>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "10px"
                                }}
                            >
                                <Button
                                    variant={orderByDesc ? "outlined" : "contained"}
                                    color="secondary"
                                    size="large"
                                    sx={{
                                        p: "14px"
                                    }}
                                    onClick={() => setOrderByDesc(!orderByDesc)}
                                >
                                    Order by {orderByDesc ? "asc" : "desc"}
                                </Button>
                                <LocalizationProvider dateAdapter={AdapterMoment}>
                                    <DesktopDatePicker
                                        label="Filter by date"
                                        value={filterDate}
                                        onChange={(newDate) => setFilterDate(newDate)}
                                    />
                                </LocalizationProvider>
                            </Box>

                            <TableContainer sx={{ mt: 2 }} className="custom-table-container" component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{fontWeight: 'bold'}}>Start</TableCell>
                                            <TableCell style={{fontWeight: 'bold'}}>End</TableCell>
                                            <TableCell style={{fontWeight: 'bold'}}>Duration</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {workSessionsList.map((workSession) => (
                                            <TableRow key={workSession.id}>
                                                <TableCell>{workSession.start}</TableCell>
                                                <TableCell>
                                                    {
                                                        workSession.end ? workSession.end :
                                                            <div className="stage">
                                                                <div className="dot-pulse"></div>
                                                            </div>
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        workSession.end ?
                                                            countIsoDateDiff(workSession.start, workSession.end) :
                                                            <div className="stage" style={{paddingLeft: "0"}}>
                                                                <div className="dot-pulse"></div>
                                                            </div>
                                                    }</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                <Pagination
                                    count={pagesCount}
                                    page={page}
                                    //onChange={handleChangePage}
                                    boundaryCount={2}
                                    siblingCount={2}
                                    color="secondary"
                                    variant="outlined"
                                />
                            </Box>
                        </>
                    }
                </>
            }
        </>

    );
};

function countIsoDateDiff(startIsoDate: string, finishIsoDate: string) {
    let start = moment(startIsoDate);
    let finish = moment(finishIsoDate);
    return moment.utc(finish.diff(start)).format("HH:mm:ss");
}