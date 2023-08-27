import React, {useState, useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {
  getUsersActionCreator,
  getUsersWorkInfoActionCreator, getUsersWorkInfoExcelActionCreator,
  setSendPasswordLinkActionCreator
} from "../../redux/epics/UserEpics";
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
import {formatIsoDate, getNewIsoDateWithTimeZone} from "../../helpers/date";
import {hasPermit} from "../../helpers/hasPermit";
import {DesktopDatePicker} from "@mui/x-date-pickers";
import moment, {Moment} from "moment/moment";

const UserWorkInfoList = () => {
  const today = moment();
  const firstDayOfPreviousMonth = today.clone().subtract(1, 'month').startOf('month');
  const lastDayOfPreviousMonth = today.clone().subtract(1, 'month').endOf('month');

  const dispatch = useAppDispatch();
  const {userWorkInfoList, excelBytesNumbers, error, isLoading} = useAppSelector(state => state.userWorkInfo);

  const {user: userData} = useAppSelector(state => state.user);

  const fullNameInputRef = useRef<HTMLInputElement | null>(null);
  const statusInputRef = useRef<HTMLInputElement | null>(null);
  const employmentRateInputRef = useRef<HTMLInputElement | null>(null);

  const usersOnPageLimit: number = 5;

  const [page, setPage] = useState<number>(1);

  const pagesCount: number = Math.ceil(userWorkInfoList.count / usersOnPageLimit);

  const [startDate, setStartDate] = useState<Moment | null>(firstDayOfPreviousMonth);
  const [endDate, setEndDate] = useState<Moment | null>(lastDayOfPreviousMonth);

  const [fullName, setFullName] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [employmentRate, setEmploymentRate] = useState<number | null | undefined>(null);

  const [fullNameInput, setFullNameInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<string>('');
  const [employmentRateInput, setEmploymentRateInput] = useState<string>('');

  const [sortBy, setSortBy] = useState<string>('fullName');

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const exportToExcel = () => {
    const byteArray = new Uint8Array(excelBytesNumbers);

    const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);

    const startDateFormatted = firstDayOfPreviousMonth.format('M/D/YYYY');
    const endDateFormatted = lastDayOfPreviousMonth.format('M/D/YYYY');
    downloadLink.download = `Report_${startDateFormatted}__${endDateFormatted}___${new Date().getTime()}.xlsx`;

    downloadLink.click();
  };

  useEffect(() => {
    dispatch(getUsersWorkInfoActionCreator({
      Offset: page * usersOnPageLimit - usersOnPageLimit,
      Limit: usersOnPageLimit,
      SortingColumn: sortBy,
      Search: fullName,
      FilteringEmploymentRate: employmentRate,
      FilteringStatus: status,
      Start:  startDate ? getNewIsoDateWithTimeZone(new Date(startDate.toISOString())) : null,
      End: endDate ? endDate.toISOString() : null
    }));

    dispatch(getUsersWorkInfoExcelActionCreator({
      SortingColumn: sortBy,
      Search: fullName,
      FilteringEmploymentRate: employmentRate,
      FilteringStatus: status,
      Start:  startDate ? getNewIsoDateWithTimeZone(new Date(startDate.toISOString())) : null,
      End: endDate ? endDate.toISOString() : null
    }));
  }, [page, fullName, status, sortBy, employmentRate, startDate, endDate]);

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
                Employees work information

                <Button
                  variant="outlined"
                  onClick={exportToExcel}
                  color="success"
                  type="submit"
                  size="small"
                  sx={{
                    mx: 1,
                  }}
                >
                  Export to Excel
                </Button>
              </h3>

              {userWorkInfoList.items && userWorkInfoList.items.length > 0
                ?
                <>
                  <Grid container spacing={2}>
                    <Grid item xs={2}>
                      <FormControl fullWidth>
                        <TextField
                          id="fullName"
                          variant="outlined"
                          color="secondary"
                          size="small"
                          label="Full name"
                          inputRef={fullNameInputRef}
                          value={fullNameInput}
                          onChange={(event) => {
                            setFullNameInput(event.target.value);

                            if (!event.target.value) {
                              setFullName('');
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Button size="small" onClick={() => {setFullName(fullNameInputRef.current ? fullNameInputRef.current?.value : '')}}
                                  >
                                    <FilterAltOutlined color="secondary" />
                                  </Button>

                                </Box>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <DesktopDatePicker
                        label="Start date"
                        slotProps={{ textField: { size: 'small' } }}
                        value={startDate}
                        onChange={(newDate) => setStartDate(newDate)}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <DesktopDatePicker
                        label="End date"
                        slotProps={{ textField: { size: 'small' } }}
                        value={endDate}
                        onChange={(newDate) => setEndDate(newDate)}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <FormControl fullWidth>
                        <TextField
                          id="status"
                          variant="outlined"
                          color="secondary"
                          size="small"
                          label="Status"
                          inputRef={statusInputRef}
                          value={statusInput}
                          onChange={(event) => {
                            setStatusInput(event.target.value);

                            if (!event.target.value) {
                              setStatus('');
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Button size="small" onClick={() => {setStatus(statusInputRef.current ? statusInputRef.current?.value : '')}}
                                  >
                                    <FilterAltOutlined color="secondary" />
                                  </Button>

                                </Box>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <FormControl fullWidth>
                        <TextField
                          id="employmentRate"
                          variant="outlined"
                          color="secondary"
                          size="small"
                          type="number"
                          label="Employment Rate"
                          inputRef={employmentRateInputRef}
                          value={employmentRateInput}
                          onChange={(event) => {
                            setEmploymentRateInput(event.target.value);

                            if (!event.target.value) {
                              setEmploymentRate(null);
                            }
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Button size="small" onClick={() => {setEmploymentRate(employmentRateInputRef.current ? parseInt(employmentRateInputRef.current?.value) : null)}}
                                  >
                                    <FilterAltOutlined color="secondary" />
                                  </Button>

                                </Box>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={2}>
                      <FormControl fullWidth>
                        <InputLabel htmlFor="selectBox">Sort by:</InputLabel>
                        <Select
                          id="selectBox"
                          label="Select Option"
                          variant="outlined"
                          value={sortBy}
                          color="secondary"
                          size="small"
                          onChange={(event) => setSortBy(event.target.value)}
                        >
                          <MenuItem value="fullName">Full Name</MenuItem>
                          <MenuItem value="employmentDate">Employment Date</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>

                  <TableContainer sx={{ mt: 2 }} className="custom-table-container" component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{fontWeight: 'bold'}}>Full Name</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Email</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Employment Rate</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Worked Hours</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Planned Hours</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Sick leave Hours</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Vacation Hours</TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userWorkInfoList.items.map((user) => (
                          <TableRow key={user.userId}>
                            <TableCell>{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.employmentRate}</TableCell>
                            <TableCell>{user.workedHours} ({((user.workedHours / user.plannedWorkingHours) * 100).toFixed(2)}%)</TableCell>
                            <TableCell>{user.plannedWorkingHours}</TableCell>
                            <TableCell>{user.sickLeaveHours}</TableCell>
                            <TableCell>{user.vacationHours}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {pagesCount > 1 && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Pagination
                      count={pagesCount}
                      page={page}
                      onChange={handleChangePage}
                      boundaryCount={2}
                      siblingCount={2}
                      color="secondary"
                      variant="outlined"
                    />
                  </Box>}
                </>

                :  <>
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Employees not found
                  </Alert>

                  <Button
                    onClick={() => {
                      setEmploymentRate(null);
                      setStatus('');
                      setFullName('');
                    }}
                    variant="outlined"
                    color="primary" sx={{mt: 2}}
                  >
                    Back to list
                  </Button>
                </>
              }
            </>
          }
        </>
      }
    </>

  );
};

export default UserWorkInfoList;