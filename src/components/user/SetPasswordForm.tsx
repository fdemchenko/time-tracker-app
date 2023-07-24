import React, {useState} from 'react';
import {Link, useParams} from "react-router-dom";
import {Alert, Box, Button, TextField} from "@mui/material";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useAppDispatch, useAppSelector} from "../../redux/CustomHooks";
import {setPasswordActionCreator} from "../../redux/epics/UserEpics";

interface SetPasswordFormData {
  email: string;
  password: string;
  repeatPassword: string;
}
const initialAuthData: SetPasswordFormData = {
  email: '',
  password: '',
  repeatPassword: ''
};
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Incorrect email').required('Email is required'),
  password: Yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  repeatPassword: Yup.string().required('Password is required').oneOf([Yup.ref('password'), ""], 'Passwords must match').min(6, 'Password must be at least 6 characters'),
});

const SetPasswordFrom = () => {
  const dispatch = useAppDispatch();
  const {link} = useParams();

  const {error} = useAppSelector(state => state.manageUsers)

  const [isSubmit, setIsSubmit] = useState(false);

  const handleSubmit = (data: SetPasswordFormData, {resetForm}: any) => {
    if (link) {
      dispatch(setPasswordActionCreator({
        Email: data.email,
        Password: data.password,
        SetPasswordLink: link
      }));

      if (!error) {
        setIsSubmit(true);
        resetForm();
      }
    }
  };

  const formik = useFormik({
    initialValues: initialAuthData,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <>
      {!isSubmit ? <div>
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
            {...formik.getFieldProps('email')}
            fullWidth
            required
            sx={{mb: 4}}
            error={formik.touched.email && !!formik.errors.email}
            helperText={formik.touched.email && formik.errors.email}
          />
          <TextField
            type="password"
            variant="outlined"
            color="secondary"
            label="Password"
            {...formik.getFieldProps('password')}
            required
            fullWidth
            sx={{mb: 4}}
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
            sx={{mb: 4}}
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

          {error ? <Alert severity="error" sx={{mt: 2}}>{error}</Alert> : ""}
        </form>
      </div> :
        <Alert severity="success" sx={{ mt: 2 }}>
        Success! Please{' '}
        <Link to="/user/login" style={{textDecoration: 'underline'}}>
          log in
        </Link>
      </Alert>
      }
      </>
  );
};

export default SetPasswordFrom;
