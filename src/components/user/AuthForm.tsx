import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Box, TextField, Button, Alert} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {loginActionCreator} from "../../redux/epics/UserEpics";
import {useNavigate} from "react-router-dom";

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
    const dispatch = useAppDispatch();
    const {isFailed, isLogged, isLoading} =
        useAppSelector(state => state.user)
    const navigate = useNavigate();

    //not working for some reason
    // if (isLogged) {
    //     navigate("/");
    // }

    const handleSubmit = (data: AuthFormData, {resetForm}: any) => {
        dispatch(loginActionCreator({
            Email: data.login,
            Password: data.password
        }));
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
              Enter your data
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

              {isLoading ? <div className="lds-dual-ring"></div> : "" }

              {isFailed ? <Alert severity="error" sx={{mt: 2}}>Login failed</Alert> : "" }
          </form>
      </div>
    );
}