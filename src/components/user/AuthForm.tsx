import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Box, TextField, Button, Alert} from '@mui/material';
import {useAppDispatch} from "../../redux/CustomHooks";
import {loginActionCreator} from "../../redux/epics/UserEpics";
import {useNavigate} from "react-router-dom";
import {UserSliceState} from "../../redux/slices/UserSlice";

interface AuthFormData {
    login: string;
    password: string;
}
const initialAuthData: AuthFormData = {
    login: '',
    password: '',
};
const validationSchema = Yup.object().shape({
  login: Yup.string().email('Incorrect login').required('Login is required'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

interface AuthFormProps {
    userData: UserSliceState
}
export default function AuthForm({userData} : AuthFormProps) {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (userData.isLogged) {
            navigate("/");
        }
    }, [userData.isLogged]);

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

              {userData.isLoading ? <div className="lds-dual-ring"></div> : "" }

              {userData.isFailed ? <Alert severity="error" sx={{mt: 2}}>Login failed</Alert> : "" }
          </form>
      </div>
    );
}