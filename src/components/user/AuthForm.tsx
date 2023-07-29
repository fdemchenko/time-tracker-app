import React from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Box, TextField, Button, Alert, Grid} from '@mui/material';
import {useAppDispatch} from "../../redux/CustomHooks";
import {loginActionCreator} from "../../redux/epics/UserEpics";
import {Navigate} from "react-router-dom";
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

    if (userData.isLogged) {
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

                        {
                            userData.error ?
                                <Alert severity="error" sx={{m: 2}}>
                                    {userData.error}
                                </Alert> : ""
                        }
                    </form>
                </div>
            </Grid>
        </Grid>
    );
}