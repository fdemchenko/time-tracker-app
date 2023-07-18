import React, {useState, useEffect} from 'react';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {getUsersActionCreator, setSendPasswordLinkActionCreator} from "../../redux/epics/UserEpics";
import {Alert, Button, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import {useNavigate} from "react-router-dom";

const UsersList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {manageUsers, error, isLoading} = useAppSelector(state => state.manageUsers)

  const handleSendPasswordLink = (email: string) => {
    dispatch(setSendPasswordLinkActionCreator(email));
  }

  useEffect(() => {
    dispatch(getUsersActionCreator());
  }, []);

  return (
    <>
      {error
        ? <Alert severity="error" sx={{mt: 2}}>{error}</Alert>
        : <>
          {isLoading
            ? <div className="lds-dual-ring"></div>
            :
            <>
              <h3>
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
                    {manageUsers.items.map((user) => (
                      <TableRow style={{backgroundColor: user.status === 'fired' ? 'rgba(255, 0, 0, 0.3)' : 'inherit'}} key={user.id}>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.employmentRate}</TableCell>
                        <TableCell>{new Date(user.employmentDate).toLocaleDateString()} {new Date(user.employmentDate).toLocaleTimeString()}</TableCell>
                        <TableCell>
                          {user.status}
                        </TableCell>
                        <TableCell>
                          {user.status === 'fired'
                            ? <span>Actions are not available</span>
                            :
                            <>
                              <Button
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

  );
};

export default UsersList;
