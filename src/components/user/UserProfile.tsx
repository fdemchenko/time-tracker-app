import React from 'react';
import {Link, useParams} from "react-router-dom";
import {useAppSelector} from "../../redux/CustomHooks";
import Profile from "../../models/Profile";
import {Alert, Button, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import {hasPermit, PermissionsEnum} from "../../helpers/hasPermit";

const UserProfile = () => {
  const {id} = useParams();

  const {profiles} = useAppSelector(state => state.profile);
  const {user} = useAppSelector(state => state.user);

  const profile: Profile | null = profiles.items.find(user => user.id === id) || null;

  return (
    <>
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
              {(hasPermit(user.permissions, PermissionsEnum[PermissionsEnum.GetWorkSession]) || user.id === profile.id) &&
                <Link to={`/worksession/${profile.id}`}>
                  <Button
                  variant="outlined"
                  color="warning"
                  type="submit"
                  size='small'
                  sx={{
                  mx: 1
                }}
                  >
                  Work sessions
                  </Button>
                </Link>
              }

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
    </>)
};

export default UserProfile;
