import React from 'react';
import {useParams} from "react-router-dom";
import {Alert, Box, Button, TextField} from "@mui/material";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useAppDispatch} from "../../redux/CustomHooks";
import {setSendPasswordLinkActionCreator} from "../../redux/epics/UserEpics";

interface AuthFormData {
  login: string;
  password: string;
  repeatPassword: string;
}
const initialAuthData: AuthFormData = {
  login: '',
  password: '',
  repeatPassword: ''
};
const validationSchema = Yup.object().shape({
  login: Yup.string().email('Incorrect login').required('Login is required'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  repeatPassword: Yup.string().required('Password is required').oneOf([Yup.ref('password'), ""], 'Passwords must match').min(6, 'Password must be at least 6 characters'),
});

const SetPasswordFrom = () => {
  const dispatch = useAppDispatch();
  const {link} = useParams();

  const handleSubmit = (data: AuthFormData, {resetForm}: any) => {
    // dispatch(setSendPasswordLinkActionCreator({
    //
    // }));

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
        <TextField
          type="password"
          variant="outlined"
          color="secondary"
          label="Repeat password"
          {...formik.getFieldProps('repeatPassword')}
          required
          fullWidth
          sx={{ mb: 4 }}
          error={formik.touched.repeatPassword && !!formik.errors.repeatPassword}
          helperText={formik.touched.repeatPassword && formik.errors.repeatPassword}
        />
        <Button
          variant="outlined"
          color="secondary"
          type="submit"
          disabled={formik.isSubmitting}
        >
          Set password
        </Button>

        {/*{userData.isLoading ? <div className="lds-dual-ring"></div> : "" }*/}

        {/*{userData.error ? <Alert severity="error" sx={{mt: 2}}>{userData.error}</Alert> : "" }*/}
      </form>
    </div>
  );
};

export default SetPasswordFrom;
