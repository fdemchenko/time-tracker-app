import React, {useEffect} from 'react';
import {Link, useParams} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {Alert, Button, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import {getProfileActionCreator, getProfilesActionCreator} from "../../redux/epics/UserEpics";

const UserProfile = () => {
  const {id} = useParams();
  const dispatch = useAppDispatch();

  const {profile, error, isLoading} = useAppSelector(state => state.profile);

  useEffect(() => {
    if (id) {
      dispatch(getProfileActionCreator(id));
    }
  }, []);

  return (
    <>
      {
        error
          ? <Alert severity="error" sx={{mt: 2}}>{error}</Alert>
          : <>
            {isLoading
              ? <div className="lds-dual-ring"></div>
              : <>
                {!profile ? (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      User not found
                    </Alert>
                  ) :
                  <div>
                    <div style={{ paddingLeft: '16px' }}>
                      <Typography variant="h5" style={{fontWeight: 'bold'}}>{profile.fullName}</Typography>
                    </div>

                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <div style={{ padding: '16px' }}>
                          <Typography style={{paddingTop: '8px'}}>Email: {profile.email}</Typography>
                          <Typography style={{paddingTop: '8px'}}>Status: {profile.status}</Typography>
                        </div>
                      </Grid>
                    </Grid>

                    <Grid container spacing={3}>
                      <Grid item xs={4} style={{marginTop: '16px'}}>
                        <Link to={`/scheduler/${profile.id}`}>
                          <Button
                            variant="outlined"
                            color="primary"
                            size='small'
                            sx={{
                              mx: 1
                            }}
                          >
                            Scheduler
                          </Button>
                        </Link>
                      </Grid>
                    </Grid>

                    <div style={{marginTop: '50px'}}>
                      <Link to={`/profiles`}>
                        <Button
                          variant="outlined"
                          color="secondary"
                          size='small'
                          sx={{
                            mx: 1
                          }}
                        >
                          Back to profiles
                        </Button>
                      </Link>
                    </div>
                  </div>
                }
              </>
            }
          </>
      }
    </>)
};

export default UserProfile;
