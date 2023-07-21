import React, {useState, useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {getUsersActionCreator, setSendPasswordLinkActionCreator} from "../../redux/epics/UserEpics";
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

const UsersList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {manageUsers, recentlyCreatedUsers, error, isLoading} = useAppSelector(state => state.manageUsers)

  const fullNameInputRef = useRef<HTMLInputElement | null>(null);
  const statusInputRef = useRef<HTMLInputElement | null>(null);
  const employmentRateInputRef = useRef<HTMLInputElement | null>(null);

  const usersOnPageLimit: number = 5;

  const [page, setPage] = useState<number>(1);

  const pagesCount: number = Math.ceil(manageUsers.count / usersOnPageLimit);

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

  const handleSendPasswordLink = (email: string) => {
    dispatch(setSendPasswordLinkActionCreator(email));
  }

  useEffect(() => {
    dispatch(getUsersActionCreator({
      Offset: page * usersOnPageLimit - usersOnPageLimit,
      Limit: usersOnPageLimit,
      SortingColumn: sortBy,
      Search: fullName,
      FilteringEmploymentRate: employmentRate,
      FilteringStatus: status,
    }));

  }, [page, fullName, status, sortBy, employmentRate]);

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
                List of employees

                  <Button
                    onClick={() => navigate('/user/create')}
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
              </h3>

              <Grid container spacing={2}>
                <Grid item xs={4}>
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

                <Grid item xs={3}>
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

                <Grid item xs={3}>
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
                      <TableCell style={{fontWeight: 'bold'}}>Employment Date</TableCell>
                      <TableCell style={{fontWeight: 'bold'}}>Status</TableCell>
                      <TableCell style={{fontWeight: 'bold'}}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {manageUsers.items.map((user) => (
                      <TableRow style={{backgroundColor: user.status === 'fired' ? 'rgba(255, 0, 0, 0.3)' : 'inherit'}} key={user.id}>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.employmentRate}</TableCell>
                        <TableCell>{formatIsoDate(getNewIsoDateWithTimeZone(new Date(user.employmentDate)))}</TableCell>
                        <TableCell>
                          {user.status}
                        </TableCell>
                        <TableCell>
                          {user.status === 'fired' || user.permissions.toLowerCase() === "all"
                            ? <span>Actions are not available</span>
                            :
                            <>
                              <Button
                                onClick={() => navigate(`/user/update/${user.id}`)}
                                variant="outlined"
                                color="primary"
                                type="submit"
                                size='small'
                                sx={{
                                  mx: 1
                                }}
                              >
                                Edit
                              </Button>

                              <Button
                                onClick={() => navigate(`/user/fire/${user.id}`)}
                                variant="outlined"
                                color="error"
                                type="submit"
                                size='small'
                                sx={{
                                  mx: 1
                                }}
                              >
                                Fire
                              </Button>

                              {!user.hasPassword && !user.hasValidSetPasswordLink
                                && <Button
                                  onClick={() => handleSendPasswordLink(user.email)}
                                  variant="outlined"
                                  color="secondary"
                                  type="submit"
                                  size='small'
                                  sx={{
                                    mx: 1
                                  }}
                                >
                                  Send password link
                                </Button>
                              }
                            </>
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
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

          {recentlyCreatedUsers && recentlyCreatedUsers.length > 0 &&
                <>
                  <h3>
                    Recently created
                  </h3>

                  <TableContainer className="custom-table-container" component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{fontWeight: 'bold'}}>Full Name</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Email</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Employment Rate</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Employment Date</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Status</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {recentlyCreatedUsers.map((user) => (
                          <TableRow style={{backgroundColor: user.status === 'fired' ? 'rgba(255, 0, 0, 0.3)' : 'inherit'}} key={user.id}>
                            <TableCell>{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.employmentRate}</TableCell>
                            <TableCell>{formatIsoDate(getNewIsoDateWithTimeZone(new Date(user.employmentDate)))}</TableCell>
                            <TableCell>
                              {user.status}
                            </TableCell>
                            <TableCell>
                              {user.status === 'fired' || user.permissions.toLowerCase() === "all"
                                ? <span>Actions are not available</span>
                                :
                                <>
                                  <Button
                                    onClick={() => navigate(`/user/update/${user.id}`)}
                                    variant="outlined"
                                    color="primary"
                                    type="submit"
                                    size='small'
                                    sx={{
                                      mx: 1
                                    }}
                                  >
                                    Edit
                                  </Button>

                                  <Button
                                    onClick={() => navigate(`/user/fire/${user.id}`)}
                                    variant="outlined"
                                    color="error"
                                    type="submit"
                                    size='small'
                                    sx={{
                                      mx: 1
                                    }}
                                  >
                                    Fire
                                  </Button>

                                  {!user.hasPassword && !user.hasValidSetPasswordLink
                                    && <Button
                                      onClick={() => handleSendPasswordLink(user.email)}
                                      variant="outlined"
                                      color="secondary"
                                      type="submit"
                                      size='small'
                                      sx={{
                                        mx: 1
                                      }}
                                    >
                                      Send password link
                                    </Button>
                                  }
                                </>
                              }
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              }
            </>
          }
        </>
      }
    </>

  );
};

export default UsersList;
