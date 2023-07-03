import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, Button } from '@mui/material';

interface AuthFormData {
    login: string;
    password: string;
}

const validationSchema = Yup.object().shape({
  login: Yup.string().email('Incorrect login').required('Login is required'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const initialAuthData: AuthFormData = {
    login: '',
    password: '',
};

export default function AuthForm() {
    const handleSubmit = (values: AuthFormData, {resetForm}: any) => {
        // Call action epic to send data to server
        console.log(values);
        resetForm();
    };

    const formik = useFormik({
        initialValues: initialAuthData,
        validationSchema,
        onSubmit: handleSubmit,
    });

    return (
      <div>
          <Box
            sx={{
                color: 'secondary.main',
                fontFamily: 'default',
                fontSize: 20,
                mb: 3,
            }}
          >
              You need to sign in first
          </Box>
          <form onSubmit={formik.handleSubmit}>
              <TextField
                type="text"
                variant="outlined"
                color="secondary"
                label="Login"
                {...formik.getFieldProps('login')}
                fullWidth
                required
                sx={{ mb: 4 }}
                error={formik.touched.login && !!formik.errors.login}
                helperText={formik.touched.login && formik.errors.login}
              />
              <TextField
                type="password"
                variant="outlined"
                color="secondary"
                label="Password"
                {...formik.getFieldProps('password')}
                required
                fullWidth
                sx={{ mb: 4 }}
                error={formik.touched.password && !!formik.errors.password}
                helperText={formik.touched.password && formik.errors.password}
              />
              <Button
                variant="outlined"
                color="secondary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                  Sign in
              </Button>
          </form>
      </div>
    );
}