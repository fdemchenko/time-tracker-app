import React from 'react';
import {Formik, Field, Form, ErrorMessage, useFormik} from 'formik';
import * as Yup from 'yup';
import {Box, Button, TextField} from '@mui/material';

interface UserFormData {
    email: string;
    fullName: string;
    employmentRate: number;
    employmentDate: string;
    permissions: string;
    status: string;
}

export default function CreateUserForm() {
// Validation schema using yup
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email is required'),
        fullName: Yup.string().required('Full name is required'),
        employmentRate: Yup.number().min(0, 'Employment rate must be at least 0').required('Employment rate is required'),
        employmentDate: Yup.date().required('Employment date is required'),
        permissions: Yup.string().required('Permissions are required'),
        status: Yup.string().required('Status is required'),
    });

    // Initial values for the form fields
    const initialValues: UserFormData = {
        email: '',
        fullName: '',
        employmentRate: 0,
        employmentDate: new Date().toISOString().slice(0, 16),
        permissions: '',
        status: '',
    };

    // Form submit handler
    const onSubmit = (values: UserFormData) => {
        // Handle form submission here, e.g., send data to the server
        console.log(values);
    };

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema,
        onSubmit: onSubmit,
    });

    return (
      <>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
              {() => (
                <Form>
                    <Box
                      sx={{
                          color: 'secondary.main',
                          fontFamily: 'default',
                          fontSize: 20,
                          mb: 3,
                          mt: 3
                      }}
                    >
                        Create new employee
                    </Box>

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
                      type="datetime-local"
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
                      label="Permissions"
                      {...formik.getFieldProps('permissions')}
                      fullWidth
                      required
                      sx={{ mb: 4 }}
                      error={formik.touched.permissions && !!formik.errors.permissions}
                      helperText={formik.touched.permissions && formik.errors.permissions}
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

                    <Button variant="outlined" color="secondary" type="submit" disabled={formik.isSubmitting}>
                        Create
                    </Button>
                </Form>
              )}
          </Formik>
      </>
    );
}