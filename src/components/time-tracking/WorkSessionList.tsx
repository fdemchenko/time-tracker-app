import React, {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import moment from 'moment';
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
    styled, InputBase, NativeSelect, TextField
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {Link, Outlet, useNavigate} from "react-router-dom";
import {getUserWorkSessionsActionCreator} from "../../redux/epics/WorkSessionEpics";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import {Moment} from "moment";
import {countIsoDateDiff, formatIsoDateTime, parseIsoDateToLocal} from "../../helpers/date";
import {hasPermit} from "../../helpers/hasPermit";
import Typography from "@mui/material/Typography";
import Tooltip from '@mui/material/Tooltip';
import WorkSession from "../../models/WorkSession";

export default function WorkSessionList() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const {
        workSessionsList, error, isLoading,
        activeWorkSession
    } = useAppSelector(state => state.workSession);
    const {user} = useAppSelector(state => state.user);

    const [limit, setLimit] = useState<number>(8);

    const [page, setPage] = useState<number>(1);

    const pagesCount: number = Math.ceil(workSessionsList.count / limit);

    const [startDate, setStartDate] = useState<Moment | null>(moment().subtract(7, 'days'));
    const [endDate, setEndDate] = useState<Moment | null>(() => moment());
    const [orderByDesc, setOrderByDesc] = useState<boolean>(true);

    const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
        setPage(newPage);
    };
    const handleClearFilters = () => {
        setPage(1);
        setStartDate(moment().subtract(7, 'days'));
        setEndDate(() => moment());
        setOrderByDesc(true);
    };

    const calculateWorkSessionWidth = (start: string, end?: string | null | undefined) => {
        const startDate = new Date(start);
        const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
        const endDate = end ? new Date(end) : new Date(new Date().getTime() + timeZoneOffset);

        const eightHoursInMillis = 8 * 60 * 60 * 1000;
        const durationInMillis = endDate.getTime() - startDate.getTime();

        let percentage = (durationInMillis / eightHoursInMillis) * 100;
        percentage = Math.min(Math.max(percentage, 3), 100);

        return percentage;
    }

    const generateToolTipString = (workSession: WorkSession): string[] => {
        const { type, title, description, lastModifierName } = workSession;

        const tooltipStrings: string[] = [];
        if (title) {
            tooltipStrings.push(`Title: ${title}`);
        }
        if (description) {
            tooltipStrings.push(`Description: ${description}`);
        }

        tooltipStrings.push(`Type: ${type}`);
        tooltipStrings.push(`Last modifier: ${lastModifierName}`);
        return tooltipStrings;
    };

    useEffect(() => {
        dispatch(getUserWorkSessionsActionCreator({
            userId: user.id,
            orderByDesc: orderByDesc,
            offset: (page - 1) * limit,
            limit: limit,
            startDate: startDate ? startDate.toISOString() : null,
            endDate: endDate ? endDate.toISOString() : null,
        }));
    }, [page, limit, startDate, endDate, orderByDesc, activeWorkSession]);

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
                            <h2 style={{marginBottom: '10px'}}>
                                List of work session

                                {hasPermit(user.permissions, "CreateWorkSessions")
                                  &&   <Button
                                    onClick={() => navigate('/worksession/create')}
                                    variant="outlined"
                                    color="success"
                                    type="submit"
                                    size="small"
                                    sx={{
                                        mx: 1,
                                    }}
                                  >
                                      Create new
                                  </Button>
                                }
                            </h2>

                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    alignItems: "flex-end",
                                    gap: "10px"
                                }}
                            >

                                <DesktopDatePicker
                                    label="Start date"
                                    value={startDate}
                                    onChange={(newDate) => setStartDate(newDate)}
                                />
                                <DesktopDatePicker
                                  label="End date"
                                  value={endDate}
                                  onChange={(newDate) => setEndDate(newDate)}
                                />

                                <Button
                                  variant={orderByDesc ? "outlined" : "contained"}
                                  color="secondary"
                                  size="small"
                                  sx={{
                                      p: "14px"
                                  }}
                                  onClick={() => setOrderByDesc(!orderByDesc)}
                                >
                                    {orderByDesc ? "New records first" : "Old records first"}
                                </Button>

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
                                    startDate &&
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
                                        <TableContainer  sx={{ mt: 2 , "& td": { border: 0 }}}
                                                         className="custom-table-container"
                                        >
                                            <Table>
                                                <TableBody>
                                                    {workSessionsList.items.map((workSession, index) => {
                                                       return <React.Fragment key={workSession.id}>
                                                           {index === 0 &&
                                                             <Typography variant="h6" sx={{mt: 2, fontWeight: 'bold'}}>
                                                                 {formatIsoDateTime(parseIsoDateToLocal(workSession.start)).split(' ')[0]}
                                                             </Typography>
                                                           }
                                                           {index > 0 && new Date(workSessionsList.items[index - 1].start).getDate() !== new Date(workSession.start).getDate()  &&
                                                             <Typography variant="h6" sx={{mt: 2, fontWeight: 'bold'}}>
                                                                 {formatIsoDateTime(parseIsoDateToLocal(workSession.start)).split(' ')[0]}
                                                             </Typography>
                                                           }
                                                           <TableRow key={workSession.id}>
                                                               <Tooltip
                                                                 title={
                                                                     <React.Fragment>
                                                                         {generateToolTipString(workSession).map((line, index) => (
                                                                           <React.Fragment key={index}>
                                                                               {line}
                                                                               <br />
                                                                           </React.Fragment>
                                                                         ))}
                                                                     </React.Fragment>
                                                                 }
                                                                 arrow
                                                                 placement="right"
                                                               >
                                                                   <div style={{backgroundColor: '#faec8e', width: `${calculateWorkSessionWidth(workSession.start, workSession.end)}%`, display: 'flex', cursor: 'pointer', flexDirection: 'column', padding: '5px', gap: '15px', marginTop: '10px'}}>
                                                                       <Typography style={{fontSize: '12px'}}>
                                                                           {
                                                                               `Start: ${formatIsoDateTime(parseIsoDateToLocal(workSession.start))}`
                                                                           }
                                                                       </Typography>

                                                                       {workSession.end &&
                                                                         <Typography style={{fontSize: '12px'}}>
                                                                             {
                                                                                 `${workSession.end ? `End: ${formatIsoDateTime(parseIsoDateToLocal(workSession.end))}` : ''}`
                                                                             }
                                                                         </Typography>
                                                                       }

                                                                       <Typography style={{fontSize: '12px'}}>
                                                                           {
                                                                             workSession.end &&
                                                                             `Duration: ${countIsoDateDiff(workSession.start, workSession.end)}`
                                                                           }
                                                                       </Typography>
                                                                   </div>
                                                               </Tooltip>

                                                               <TableCell>
                                                                   {workSession.end &&
                                                                     <Box
                                                                       sx={{
                                                                           display: "flex",
                                                                           alignItems: "center",
                                                                           gap: "30px"
                                                                       }}
                                                                     >
                                                                         <Link to={`/worksession/update/${workSession.id}`}>
                                                                             <EditIcon />
                                                                         </Link>


                                                                         <Link to={`/worksession/delete/${workSession.id}`}>
                                                                             <DeleteIcon />
                                                                         </Link>
                                                                     </Box>
                                                                   }
                                                               </TableCell>
                                                           </TableRow>
                                                       </React.Fragment>
                                                    })}
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