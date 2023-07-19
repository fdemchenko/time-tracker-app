import React from 'react';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../redux/CustomHooks';
import {useNavigate, useParams} from 'react-router-dom';
import User from '../../models/User';
import { Alert, CircularProgress, Box, Button, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material';
import { getNewIsoDateWithTimeZone } from '../../helpers/date';
import { useFormik } from 'formik';
import { hasPermit } from '../../helpers/hasPermit';
import {updateUserActionCreator} from "../../redux/epics/UserEpics";

interface UpdateUserFormData {
  email: string;
  fullName: string;
  employmentRate: number;
  employmentDate: string;
  createUserPermission: boolean;
  updateUserPermission: boolean;
  fireUserPermission: boolean;
  getUsersPermission: boolean;
  approveVacationsPermission: boolean;
  status: string;
}

const UpdateUserForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {id} = useParams();

  const {manageUsers, error, isLoading} = useAppSelector(state => state.manageUsers);
  const inputUser: User | null = manageUsers.items.find(user => user.id === id) || null;

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
    fireUserPermission: Yup.boolean(),
    getUsersPermission: Yup.boolean(),
    status: Yup.string().required('Status is required'),
  });

  const initialValues: UpdateUserFormData = {
    email: inputUser ? inputUser.email : '',
    fullName: inputUser ? inputUser.fullName : '',
    employmentRate: inputUser ? inputUser.employmentRate : 100,
    employmentDate: inputUser ? getNewIsoDateWithTimeZone(new Date(inputUser.employmentDate)).slice(0, 10) : getNewIsoDateWithTimeZone().slice(0, 10),
    createUserPermission: inputUser ? hasPermit(inputUser.permissions, 'CreateUser') : false,
    updateUserPermission: inputUser ? hasPermit(inputUser.permissions, 'UpdateUser') : false,
    fireUserPermission: inputUser ? hasPermit(inputUser.permissions, 'FireUser') : false,
    getUsersPermission: inputUser ? hasPermit(inputUser.permissions, 'GetUsers') : false,
    approveVacationsPermission: inputUser ? hasPermit(inputUser.permissions, 'ApproveVacations') : false,
    status: inputUser ? inputUser.status : '',
  };

  const onSubmit = (values: UpdateUserFormData, {resetForm}: any) => {
    const permissions = JSON.stringify({
      GetUsers: values.getUsersPermission,
      CreateUser: values.createUserPermission,
      FireUser: values.fireUserPermission,
      ApproveVacation: values.approveVacationsPermission,
      UpdateUser: values.updateUserPermission,
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
                              onChange={formik.handleChange}
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
                              checked={!formik.values.getUsersPermission ? false : formik.values.fireUserPermission}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              name="fireUserPermission"
                              disabled={!formik.values.getUsersPermission}
                            />
                          }
                          label="Fire users"
                        />
                      </Grid>

                      <Grid item xs={4}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              color="secondary"
                              checked={formik.values.approveVacationsPermission}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              name="approveVacationsPermission"
                            />
                          }
                          label="Approve vacations"
                        />
                      </Grid>

                      <Grid item xs={4}>

                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Button variant="outlined" color="secondary" type="submit">
                  Update
                </Button>
              </form>
            </>
          )}
        </>
      )}
    </>
  );
};

export default UpdateUserForm;