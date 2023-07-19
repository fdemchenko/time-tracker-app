import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Alert, Box, Button, Checkbox, FormControlLabel, Grid, TextField} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {createUserActionCreator} from "../../redux/epics/UserEpics";
import {getNewIsoDateWithTimeZone} from "../../helpers/date";
import {useNavigate} from "react-router-dom";

interface CreateUserFormData {
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

export default function CreateUserForm() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {error, isLoading} = useAppSelector(state => state.manageUsers);

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

    const initialValues: CreateUserFormData = {
        email: '',
        fullName: '',
        employmentRate: 100,
        employmentDate: getNewIsoDateWithTimeZone().slice(0, 10),
        createUserPermission: false,
        updateUserPermission: false,
        fireUserPermission: false,
        getUsersPermission: false,
        approveVacationsPermission: false,
        status: '',
    };

    const onSubmit = (values: CreateUserFormData, {resetForm}: any) => {
        const permissions = JSON.stringify({
          GetUsers: values.getUsersPermission,
          CreateUser: values.createUserPermission,
          FireUser: values.fireUserPermission,
          ApproveVacation: values.approveVacationsPermission,
          UpdateUser: values.updateUserPermission,
        });

        dispatch(createUserActionCreator({
          Email: values.email,
          FullName: values.fullName,
          EmploymentRate: values.employmentRate,
          EmploymentDate: `${new Date(values.employmentDate).toISOString()}`,
          Status: values.status,
          Permissions: permissions
        }));

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
        {error && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}

        {isLoading
          ? <div className="lds-dual-ring"></div>
          :  <form onSubmit={formik.handleSubmit}>
            <Box
              sx={{
                color: 'secondary.main',
                fontFamily: 'default',
                fontSize: 20,
                mb: 3,
                mt: 3,
              }}
            >
              Create new employee
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
                              formik.setFieldValue('fireUserPermission', false);
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
              Create
            </Button>
          </form>
        }
      </>
    );
}