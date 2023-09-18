import React, {useState, useEffect, useRef} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {
  getProfilesActionCreator,
  getUsersActionCreator,
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
import {Link, useNavigate} from "react-router-dom";
import {formatIsoDate, getNewIsoDateWithTimeZone} from "../../helpers/date";
import {hasPermit} from "../../helpers/hasPermit";

const ProfilesList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {manageUsers} = useAppSelector(state => state.manageUsers);
  const {profiles, error, isLoading} = useAppSelector(state => state.profile);
  const {user: userData} = useAppSelector(state => state.user);

  const fullNameInputRef = useRef<HTMLInputElement | null>(null);
  const statusInputRef = useRef<HTMLInputElement | null>(null);
  const employmentRateInputRef = useRef<HTMLInputElement | null>(null);

  const usersOnPageLimit: number = 5;

  const [page, setPage] = useState<number>(1);

  const pagesCount: number = Math.ceil(profiles.count / usersOnPageLimit);

  const [fullName, setFullName] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [employmentRate, setEmploymentRate] = useState<number | null | undefined>(null);

  const [fullNameInput, setFullNameInput] = useState<string>('');
  const [statusInput, setStatusInput] = useState<string>('');

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  useEffect(() => {
    dispatch(getProfilesActionCreator({
      Offset: page * usersOnPageLimit - usersOnPageLimit,
      Limit: usersOnPageLimit,
      Search: fullName,
      FilteringStatus: status,
    }));
  }, []);


  useEffect(() => {
    dispatch(getProfilesActionCreator({
      Offset: page * usersOnPageLimit - usersOnPageLimit,
      Limit: usersOnPageLimit,
      Search: fullName,
      FilteringStatus: status,
    }));

  }, [page, fullName, status, employmentRate]);

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
                List of profiles of employees

                {hasPermit(userData.permissions, "CreateUser")
                    &&   <Button
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
                }
              </h3>

              {profiles.items && profiles.items.length > 0
                ?
                <>
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

                  </Grid>

                  <TableContainer sx={{ mt: 2 }} className="custom-table-container" component={Paper}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{fontWeight: 'bold'}}>Full Name</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Email</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Status</TableCell>
                          <TableCell style={{fontWeight: 'bold'}}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {profiles.items.map((user) => (
                          <TableRow style={{backgroundColor: user.status === 'deactivated' ? 'rgba(255, 0, 0, 0.3)' : 'inherit'}} key={user.id}>
                            <TableCell>{user.fullName}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              {user.status}
                            </TableCell>
                            <TableCell>
                              <Link to={`/profile/${user.id}`}>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  type="submit"
                                  size='small'
                                >
                                  Profile
                                </Button>
                              </Link>
                            </TableCell>
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

export default ProfilesList;
