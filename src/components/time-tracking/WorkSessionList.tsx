import React, {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {
    Alert,
    Box,
    Button,
    FormControl,
    Pagination,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    styled, InputBase, NativeSelect
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Link, Outlet} from "react-router-dom";
import {getUserWorkSessionsActionCreator} from "../../redux/epics/WorkSessionEpics";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import {Moment} from "moment";
import {countIsoDateDiff, formatIsoDateTime, parseIsoDateToLocal} from "../../helpers/date";

export default function WorkSessionList() {
    const dispatch = useAppDispatch();
    const {
        workSessionsList, error, isLoading,
        activeWorkSession
    } = useAppSelector(state => state.workSession);
    const {user} = useAppSelector(state => state.user);

    const [limit, setLimit] = useState<number>(8);

    const [page, setPage] = useState<number>(1);

    const pagesCount: number = Math.ceil(workSessionsList.count / limit);

    const [filterDate, setFilterDate] = useState<Moment | null>(null);
    const [orderByDesc, setOrderByDesc] = useState<boolean>(true);

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };
    const handleClearFilters = () => {
        setPage(1);
        setFilterDate(null);
        setOrderByDesc(true);
    };

    useEffect(() => {
        dispatch(getUserWorkSessionsActionCreator({
            userId: user.id,
            orderByDesc: orderByDesc,
            offset: (page - 1) * limit,
            limit: limit,
            filterDate: filterDate ? filterDate.toISOString() : null
        }));
    }, [page, limit, filterDate, orderByDesc, activeWorkSession]);

    return (
        <>
            {error
                ? <Alert severity="error" sx={{mt: 2}}>{error}</Alert>
                : <>
                    <Outlet/>

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
                                    alignItems: "flex-end",
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
                                    {orderByDesc ? "New records first" : "Old records first"}
                                </Button>
                                <DesktopDatePicker
                                    label="Filter by date"
                                    value={filterDate}
                                    onChange={(newDate) => setFilterDate(newDate)}
                                />
                                <FormControl variant="standard">
                                    <NativeSelect
                                        value={limit.toString()}
                                        onChange={(event: { target: { value: string } }) =>
                                            setLimit(Number(event.target.value))}
                                        input={<BootstrapInput/>}
                                    >
                                        <option value={5}>5</option>
                                        <option value={8}>8</option>
                                        <option value={10}>10</option>
                                        <option value={15}>20</option>
                                        <option value={30}>30</option>
                                    </NativeSelect>
                                </FormControl>
                                {
                                    filterDate &&
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        onClick={handleClearFilters}
                                    >
                                        Clear filters
                                    </Button>
                                }
                            </Box>

                            {
                                workSessionsList.items.length > 0 ? (
                                    <>
                                        <TableContainer sx={{mt: 2}} className="custom-table-container"
                                                        component={Paper}>
                                            <Table>
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell style={{fontWeight: 'bold'}}>
                                                            Start
                                                            <Box
                                                                sx={{
                                                                    color: 'text.disabled',
                                                                    fontSize: "0.875rem"
                                                                }}
                                                            >
                                                                MM/DD/YYYY HH:mm:ss
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell style={{fontWeight: 'bold'}}>
                                                            End
                                                            <Box
                                                                sx={{
                                                                    color: 'text.disabled',
                                                                    fontSize: "0.875rem"
                                                                }}
                                                            >
                                                                MM/DD/YYYY HH:mm:ss
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell style={{fontWeight: 'bold'}}>
                                                            Duration
                                                            <Box
                                                                sx={{
                                                                    color: 'text.disabled',
                                                                    fontSize: "0.875rem"
                                                                }}
                                                            >
                                                                HH:mm:ss
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell style={{fontWeight: 'bold'}}></TableCell>
                                                        <TableCell style={{fontWeight: 'bold'}}></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {workSessionsList.items.map((workSession) => (
                                                        <TableRow key={workSession.id}>
                                                            <TableCell>
                                                                {
                                                                    formatIsoDateTime(parseIsoDateToLocal(workSession.start))
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    workSession.end ?
                                                                        formatIsoDateTime(parseIsoDateToLocal(workSession.end)) :
                                                                        <div className="stage">
                                                                            <div className="dot-pulse"></div>
                                                                        </div>
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    workSession.end ?
                                                                        countIsoDateDiff(workSession.start, workSession.end) :
                                                                        <div className="stage"
                                                                             style={{paddingLeft: "0"}}>
                                                                            <div className="dot-pulse"></div>
                                                                        </div>
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    workSession.end &&
                                                                    <Link to={`/worksession/update/${workSession.id}`}>
                                                                        <EditIcon />
                                                                    </Link>
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    workSession.end &&
                                                                    <Link to={`/worksession/delete/${workSession.id}`}>
                                                                        <DeleteIcon />
                                                                    </Link>
                                                                }
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>

                                        <Box sx={{display: 'flex', justifyContent: 'center', mt: 2}}>
                                            <Pagination
                                                count={pagesCount}
                                                page={page}
                                                onChange={handleChangePage}
                                                boundaryCount={2}
                                                siblingCount={2}
                                                color="secondary"
                                                variant="outlined"
                                            />
                                        </Box>
                                    </>
                                ) : (
                                    <Alert severity="info" sx={{m: 2}}>
                                        There are no records for now
                                    </Alert>
                                )
                            }
                        </>
                    }
                </>
            }
        </>

    );
};

const BootstrapInput = styled(InputBase)(({theme}) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));