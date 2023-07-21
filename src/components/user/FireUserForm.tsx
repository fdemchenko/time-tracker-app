import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from "../../redux/CustomHooks";
import { useNavigate, useParams } from "react-router-dom";
import User from "../../models/User";
import {Alert, Box, Button, Checkbox, CircularProgress, FormControlLabel, Grid, TextField} from "@mui/material";
import {fireUserActionCreator} from "../../redux/epics/UserEpics";

const FireUserForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {id} = useParams();

  const {manageUsers, recentlyCreatedUsers, error, isLoading} = useAppSelector(state => state.manageUsers);
  const inputUser: User | null = manageUsers.items.find(user => user.id === id)
    || recentlyCreatedUsers.find(user => user.id === id)
    || null;

  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleConfirm = () => {
    if (id)
      dispatch(fireUserActionCreator(id));

    if (!error) {
      navigate('/users');
    }
  };

  return (
    <>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {!inputUser ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              User not found
            </Alert>
          ) : (
            <>
              {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

              <Box
                sx={{
                  color: 'secondary.main',
                  fontFamily: 'default',
                  fontSize: 32,
                  mb: 3,
                  mt: 3,
                }}
              >
                Fire employee
              </Box>

              <div>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Alert severity="warning" sx={{ fontSize: '18px' }}>
                      Are you sure you want to fire this employee: <span style={{ fontWeight: 'bold' }}>{inputUser.fullName}</span>?
                    </Alert>
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isConfirmed}
                          onChange={(e) => setIsConfirmed(e.target.checked)}
                          color="error"
                        />
                      }
                      label="I confirm that I want to terminate this user"
                    />
                  </Grid>
                </Grid>

                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleConfirm}
                  disabled={!isConfirmed}
                  sx={{mt: 2}}
                >
                  Fire
                </Button>

                <Button onClick={() => navigate('/users')} variant="outlined" color="primary" sx={{ml: 2, mt: 2}}>
                  Back to list
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default FireUserForm;