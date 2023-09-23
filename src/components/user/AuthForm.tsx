import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Box, TextField, Button, Alert, Grid} from '@mui/material';
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {googleLoginActionCreator, loginActionCreator} from "../../redux/epics/UserEpics";
import {Navigate} from "react-router-dom";
import {SetUserError} from "../../redux/slices/UserSlice";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import {GoogleLoginFailedErrorMessage} from "../../helpers/errors";

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

export default function AuthForm() {
    const dispatch = useAppDispatch();

    const {isLogged, isLoading, error} = useAppSelector(state => state.user);

    function completeGoogleAuth(credentialResponse: CredentialResponse) {
        dispatch(googleLoginActionCreator(credentialResponse));
    }
    function failedGoogleAuth() {
        dispatch(SetUserError(GoogleLoginFailedErrorMessage));
    }

    const formik = useFormik({
        initialValues: initialAuthData,
        validationSchema,
        onSubmit: (data: AuthFormData, {resetForm}: any) => {
            dispatch(loginActionCreator({
                Email: data.login,
                Password: data.password
            }));
            resetForm();
        },
    });

    if (isLogged) {
        return (<Navigate to="/" />);
    }

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '80vh' }}
        >
            <Grid item xs={3}>
                <div>
                    <Box
                        sx={{
                            color: 'secondary.main',
                            fontFamily: 'default',
                            fontSize: 20,
                            mb: 3,
                        }}
                    >
                        <p>Welcome to Time Tracker App</p>
                        <p>Please, sign in to start working</p>
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
                        <Box sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            flexWrap: "wrap",
                            gap: 2
                        }}>
                            <Button
                              variant="outlined"
                              color="secondary"
                              type="submit"
                              disabled={formik.isSubmitting}
                            >
                                Sign in
                            </Button>
                            <GoogleLogin
                              onSuccess={completeGoogleAuth}
                              onError={() => failedGoogleAuth()}
                            />
                        </Box>

                        {isLoading ? <div className="lds-dual-ring"></div> : "" }

                        {
                            error &&
                            <Alert severity="error" sx={{my: 2}}>
                                {error}
                            </Alert>
                        }
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}