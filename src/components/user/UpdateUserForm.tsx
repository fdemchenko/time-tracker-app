import React from 'react';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux/CustomHooks';
import {Link, useNavigate, useParams} from 'react-router-dom';
import User from '../../models/User';
import { Alert, CircularProgress, Box, Button, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { getNewIsoDateWithTimeZone } from '../../helpers/date';
import { useFormik } from 'formik';
import {hasPermit, PermissionsEnum} from '../../helpers/hasPermit';
import {updateUserActionCreator} from "../../redux/epics/UserEpics";

interface UpdateUserFormData {
  email: string;
  fullName: string;
  employmentRate: number;
  employmentDate: string;
  createUserPermission: boolean;
  updateUserPermission: boolean;
  deactivateUserPermission: boolean;
  getUsersPermission: boolean;
  getUsersWorkInfoPermission: boolean;
  getWorkSessionsPermission: boolean;
  createWorkSessionsPermission: boolean;
  updateWorkSessionsPermission: boolean;
  deleteWorkSessionsPermission: boolean;
  manageHolidaysPermission: boolean;
  approveVacationsPermission: boolean;
  getVacationsPermission: boolean;
  manageSickLeavesPermission: boolean;
  status: string;
}

const UpdateUserForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {id} = useParams();

  const {manageUsers, recentlyCreatedUsers, error, isLoading} = useAppSelector(state => state.manageUsers);
  const inputUser: User | null = manageUsers.items.find(user => user.id === id)
    || recentlyCreatedUsers.find(user => user.id === id)
    || null;

  const {user: userData} = useAppSelector(state => state.user);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    fullName: Yup.string().required('Full name is required'),
    employmentRate: Yup.number()
      .min(1, 'Employment rate must be at least 1')
      .max(100, 'Employment rate must be no more than 100')
      .required('Employment rate is required'),
    employmentDate: Yup.date().required('Employment date is required'),
    createUserPermission: Yup.boolean(),
    updateUserPermission: Yup.boolean(),
    deactivateUserPermission: Yup.boolean(),
    getUsersPermission: Yup.boolean(),
    getUsersWorkInfoPermission: Yup.boolean(),
    getWorkSessionsPermission: Yup.boolean(),
    createWorkSessionsPermission: Yup.boolean(),
    updateWorkSessionsPermission: Yup.boolean(),
    deleteWorkSessionsPermission: Yup.boolean(),
    manageHolidaysPermission: Yup.boolean(),
    approveVacationsPermission: Yup.boolean(),
    getVacationsPermission: Yup.boolean(),
    manageSickLeavesPermission: Yup.boolean(),
    status: Yup.string().required('Status is required'),
  });

  const initialValues: UpdateUserFormData = {
    email: inputUser ? inputUser.email : '',
    fullName: inputUser ? inputUser.fullName : '',
    employmentRate: inputUser ? inputUser.employmentRate : 100,
    employmentDate: inputUser ? getNewIsoDateWithTimeZone(new Date(inputUser.employmentDate)).slice(0, 10) : getNewIsoDateWithTimeZone().slice(0, 10),
    createUserPermission: inputUser ? hasPermit(inputUser.permissions, 'CreateUser') : false,
    updateUserPermission: inputUser ? hasPermit(inputUser.permissions, 'UpdateUser') : false,
    deactivateUserPermission: inputUser ? hasPermit(inputUser.permissions, 'DeactivateUser') : false,
    getUsersPermission: inputUser ? hasPermit(inputUser.permissions, 'GetUsers') : false,
    getUsersWorkInfoPermission: inputUser ? hasPermit(inputUser.permissions, 'GetUsersWorkInfo') : false,
    getWorkSessionsPermission: inputUser ? hasPermit(inputUser.permissions, 'GetWorkSessions') : false,
    createWorkSessionsPermission: inputUser ? hasPermit(inputUser.permissions, 'CreateWorkSessions') : false,
    updateWorkSessionsPermission: inputUser ? hasPermit(inputUser.permissions, 'UpdateWorkSessions') : false,
    deleteWorkSessionsPermission: inputUser ? hasPermit(inputUser.permissions, 'DeleteWorkSessions') : false,
    manageHolidaysPermission: inputUser ? hasPermit(inputUser.permissions, "ManageHolidays") : false,
    approveVacationsPermission: inputUser ? hasPermit(inputUser.permissions, 'ApproveVacations') : false,
    getVacationsPermission: inputUser ? hasPermit(inputUser.permissions, PermissionsEnum[PermissionsEnum.GetVacations]) : false,
    manageSickLeavesPermission: inputUser ? hasPermit(inputUser.permissions, PermissionsEnum[PermissionsEnum.ManageSickLeaves]) : false,
    status: inputUser ? inputUser.status : '',
  };

  const onSubmit = (values: UpdateUserFormData, {resetForm}: any) => {
    const permissions = JSON.stringify({
      GetUsers: values.getUsersPermission,
      GetUsersWorkInfo: values.getUsersWorkInfoPermission,
      CreateUser: values.createUserPermission,
      DeactivateUser: values.deactivateUserPermission,
      ApproveVacations: values.approveVacationsPermission,
      UpdateUser: values.updateUserPermission,
      GetWorkSessions: values.getWorkSessionsPermission,
      UpdateWorkSessions: values.updateWorkSessionsPermission,
      CreateWorkSessions: values.createWorkSessionsPermission,
      DeleteWorkSessions: values.deleteWorkSessionsPermission,
      ManageHolidays: values.manageHolidaysPermission,
      [`${PermissionsEnum[PermissionsEnum.ApproveVacations]}`]: values.approveVacationsPermission,
      [`${PermissionsEnum[PermissionsEnum.GetVacations]}`]: values.getVacationsPermission,
      [`${PermissionsEnum[PermissionsEnum.ManageSickLeaves]}`]: values.manageSickLeavesPermission
    });

    if (id) {
      dispatch(updateUserActionCreator({
        Id: id,
        Email: values.email,
        FullName: values.fullName,
        EmploymentRate: values.employmentRate,
        EmploymentDate: `${new Date(values.employmentDate).toISOString()}`,
        Status: values.status,
        Permissions: permissions
      }));
    }

    if (!error) {
      resetForm();

      navigate('/users');
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema,
    onSubmit: onSubmit,
  });

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

              <form onSubmit={formik.handleSubmit}>
                <Box
                  sx={{
                    color: 'secondary.main',
                    fontFamily: 'default',
                    fontSize: 20,
                    mb: 3,
                    mt: 3,
                  }}
                >
                  Update employee
                </Box>

                <Grid container spacing={4}>
                  <Grid item xs={6}>
                    <TextField
                      type="email"
                      variant="outlined"
                      color="secondary"
                      label="Email"
                      {...formik.getFieldProps('email')}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                      error={formik.touched.email && !!formik.errors.email}
                      helperText={formik.touched.email && formik.errors.email}
                    />

                    <TextField
                      type="text"
                      variant="outlined"
                      color="secondary"
                      label="Full Name"
                      {...formik.getFieldProps('fullName')}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                      error={formik.touched.fullName && !!formik.errors.fullName}
                      helperText={formik.touched.fullName && formik.errors.fullName}
                    />

                    <TextField
                      type="number"
                      variant="outlined"
                      color="secondary"
                      label="Employment Rate"
                      {...formik.getFieldProps('employmentRate')}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                      error={formik.touched.employmentRate && !!formik.errors.employmentRate}
                      helperText={formik.touched.employmentRate && formik.errors.employmentRate}
                    />

                    <TextField
                      type="date"
                      variant="outlined"
                      color="secondary"
                      label="Employment Date"
                      {...formik.getFieldProps('employmentDate')}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                      error={formik.touched.employmentDate && !!formik.errors.employmentDate}
                      helperText={formik.touched.employmentDate && formik.errors.employmentDate}
                    />

                    <TextField
                      type="text"
                      variant="outlined"
                      color="secondary"
                      label="Status"
                      {...formik.getFieldProps('status')}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                      error={formik.touched.status && !!formik.errors.status}
                      helperText={formik.touched.status && formik.errors.status}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <Grid container spacing={2}>
                      <Grid item xs={4}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={formik.values.getUsersPermission}
                              onChange={(e) => {
                                formik.handleChange(e);

                                if (!e.target.checked) {
                                  formik.setFieldValue('createUserPermission', false);
                                  formik.setFieldValue('updateUserPermission', false);
                                  formik.setFieldValue('deactivateUserPermission', false);
                                }
                              }}
                              onBlur={formik.handleBlur}
                              name="getUsersPermission"
                            />
                          }
                          label="Get users"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={!formik.values.getUsersPermission ? false : formik.values.getUsersWorkInfoPermission}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              name="getUsersWorkInfoPermission"
                              disabled={!formik.values.getUsersPermission}
                            />
                          }
                          label="Get users work info"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={!formik.values.getUsersPermission ? false : formik.values.createUserPermission}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              name="createUserPermission"
                              disabled={!formik.values.getUsersPermission}
                            />
                          }
                          label="Create users"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={!formik.values.getUsersPermission ? false : formik.values.updateUserPermission}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              name="updateUserPermission"
                              disabled={!formik.values.getUsersPermission}
                            />
                          }
                          label="Update users"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={!formik.values.getUsersPermission ? false : formik.values.deactivateUserPermission}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              name="deactivateUserPermission"
                              disabled={!formik.values.getUsersPermission}
                            />
                          }
                          label="Deactivate users"
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <FormControlLabel
                            control={
                              <Checkbox
                                  color="secondary"
                                  checked={formik.values.getVacationsPermission}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  name="getVacationsPermission"
                              />
                            }
                            label="Get vacations"
                        />
                        <FormControlLabel
                            control={
                              <Checkbox
                                  color="secondary"
                                  checked={formik.values.approveVacationsPermission}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  name="approveVacationsPermission"
                                  disabled={!formik.values.getVacationsPermission}
                              />
                            }
                            label="Approve vacations"
                        />
                        <FormControlLabel
                            control={
                              <Checkbox
                                  color="secondary"
                                  checked={formik.values.manageHolidaysPermission}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  name="manageHolidaysPermission"
                              />
                            }
                            label="Manage holidays"
                        />
                        <FormControlLabel
                            control={
                              <Checkbox
                                  color="secondary"
                                  checked={formik.values.manageSickLeavesPermission}
                                  onChange={formik.handleChange}
                                  onBlur={formik.handleBlur}
                                  name="manageSickLeavesPermission"
                              />
                            }
                            label="Manage sick leave    "
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={formik.values.getWorkSessionsPermission}
                              onChange={(e) => {
                                formik.handleChange(e);

                                if (!e.target.checked) {
                                  formik.setFieldValue('createWorkSessionsPermission', false);
                                  formik.setFieldValue('updateWorkSessionsPermission', false);
                                  formik.setFieldValue('deleteWorkSessionsPermission', false);
                                }
                              }}
                              onBlur={formik.handleBlur}
                              name="getWorkSessionsPermission"
                            />
                          }
                          label="Get work sessions"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={!formik.values.getWorkSessionsPermission ? false : formik.values.createWorkSessionsPermission}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              name="createWorkSessionsPermission"
                              disabled={!formik.values.getWorkSessionsPermission}
                            />
                          }
                          label="Create work sessions"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={!formik.values.getWorkSessionsPermission ? false : formik.values.updateWorkSessionsPermission}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              name="updateWorkSessionsPermission"
                              disabled={!formik.values.getWorkSessionsPermission}
                            />
                          }
                          label="Update work sessions"
                        />

                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={!formik.values.getWorkSessionsPermission ? false : formik.values.deleteWorkSessionsPermission}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              name="deleteWorkSessionsPermission"
                              disabled={!formik.values.getWorkSessionsPermission}
                            />
                          }
                          label="Delete work sessions"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Button variant="outlined" color="secondary" type="submit">
                  Update
                </Button>

                <Button onClick={() => navigate('/users')} variant="outlined" color="primary" sx={{ml: 2}}>
                  Back to list
                </Button>
              </form>

              {hasPermit(userData.permissions, "DeactivateUser") &&
                <Link to={`/user/deactivate/${id}`} style={{ textDecoration: 'none' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    type="submit"
                    sx={{
                      mt: 3
                    }}
                  >
                    Deactivate account
                  </Button>
                </Link>
              }
            </>
          )}
        </>
      )}
    </>
  );
};

export default UpdateUserForm;