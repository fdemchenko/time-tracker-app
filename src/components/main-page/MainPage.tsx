import {UserSliceState} from "../../redux/slices/UserSlice";
import React from "react";
import {Alert, Button, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import {hasPermit} from "../../helpers/hasPermit";
import {Link} from "react-router-dom";

interface MainPageProps {
    userData: UserSliceState
}

interface Permissions {
  createUser?: boolean,
  updateUser?: boolean,
  deactivateUser?: boolean,
  getUsers?: boolean,
  getWorkSessions?: boolean,
  createWorkSessions?: boolean,
  updateWorkSessions?: boolean,
  approveVacations?: boolean,
  deleteWorkSessions?: boolean,
  manageHolidays?: boolean,
}

export default function MainPage({userData}: MainPageProps) {
  const permissions: Permissions = {};

  if (userData.user.permissions && userData.user.permissions !== 'ALL') {
    permissions.createUser = hasPermit(userData.user.permissions, 'CreateUser');
    permissions.getUsers = hasPermit(userData.user.permissions, 'GetUsers');
    permissions.updateUser = hasPermit(userData.user.permissions, 'UpdateUser');
    permissions.deactivateUser = hasPermit(userData.user.permissions, 'DeactivateUser');

    permissions.getWorkSessions = hasPermit(userData.user.permissions, 'GetWorkSessions');
    permissions.createWorkSessions = hasPermit(userData.user.permissions, 'CreateWorkSessions');
    permissions.updateWorkSessions = hasPermit(userData.user.permissions, 'UpdateWorkSessions');
    permissions.deleteWorkSessions = hasPermit(userData.user.permissions, 'DeleteWorkSessions');

    permissions.manageHolidays = hasPermit(userData.user.permissions, 'ManageHolidays');

    permissions.approveVacations = hasPermit(userData.user.permissions, 'ApproveVacations');
  }

    return (
        <div>
          <div style={{ paddingLeft: '16px' }}>
            <Typography variant="h5" style={{fontWeight: 'bold'}}>Hello, {userData.user.fullName}!</Typography>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={4}>
              <div style={{ padding: '16px' }}>
                <Typography style={{paddingTop: '8px'}}>Email: {userData.user.email}</Typography>
                <Typography style={{paddingTop: '8px'}}>Employment rate: {userData.user.employmentRate}</Typography>
                <Typography style={{paddingTop: '8px'}}>Employment date: {new Date(userData.user.employmentDate).toLocaleDateString()}</Typography>
              </div>
            </Grid>

            <Grid item xs={4}>
              <div style={{ padding: '16px' }}>
                <Typography>Status: {userData.user.status}</Typography>
              </div>
            </Grid>
          </Grid>

          {(userData.user.permissions === 'ALL' || permissions.getUsers) &&
            <div style={{ padding: '16px' }}>
              <Link to="/users">
                <Button
                  variant="outlined"
                  color="secondary"
                  type="submit"
                  sx={{
                    mx: 2
                  }}
                >
                  Manage users
                </Button>
              </Link>
            </div>
          }

            {userData.error ? <Alert severity="error" sx={{mt: 2}}>{userData.error}</Alert> : "" }
        </div>
    );
}