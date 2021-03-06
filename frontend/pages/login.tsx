import AppContext from '@/components/Context/TopLevelContext';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import API from 'utils/api';
import * as yup from 'yup';
import InputAdornment from '@mui/material/InputAdornment';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { determineIfUserIsAuthentication } from 'utils/Authentication';
import { Google } from '@mui/icons-material';

type Props = {};

const Login = (props: Props) => {
  const router = useRouter();
  const { authenticationDetails, setAuthenticationDetails } = useContext(AppContext);
  const isUserAuthenticated = determineIfUserIsAuthentication(authenticationDetails.accessToken);

  const [LoggedInErrored, setLoggedInErrored] = useState('');
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: yup.object({
      email: yup.string().email().required('Email is required'),
      password: yup.string().required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const { data } = await API.CLIENT.post(API.ENDPOINT.AUTHENTICATION.LOGIN, values);
        const { access_token: accessToken, refresh_token: refreshToken } = data;
        // Set access_token and refresh_token in localstorage
        localStorage.setItem('access-token', accessToken);
        localStorage.setItem('refresh-token', refreshToken);
        setAuthenticationDetails({
          accessToken,
          refreshToken,
        });
        setLoggedInErrored('');
        router.push('/');
      } catch (error) {
        // For an unknown reason, typescript doesnt seem to be able to infer the type of error.
        // @ts-ignore
        if (axios.isAxiosError(error) && error?.response.status === 400) {
          setLoggedInErrored('Email or password is incorrect');
        } else {
          console.error(error);
          setLoggedInErrored('Something went wrong, please try again');
        }
      }
    },
  });

  if (isUserAuthenticated) {
    router.push('/');
  }

  const MARGIN = '2em';

  return (
    <Card sx={{ minWidth: 250 }}>
      <Grid container alignItems="center" justifyContent="center" direction="column">
        <Grid container alignItems="center" justifyContent="center" direction="column">
          <form onSubmit={formik.handleSubmit}>
            {LoggedInErrored && <Alert severity="error">{LoggedInErrored}</Alert>}
            <TextField
              sx={{ marginTop: MARGIN, marginBottom: MARGIN }}
              variant="outlined"
              fullWidth
              label="Email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            ></TextField>
            <TextField
              variant="outlined"
              sx={{ marginBottom: MARGIN }}
              fullWidth
              label="Password"
              id="password"
              type={'password'}
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PasswordIcon />
                  </InputAdornment>
                ),
              }}
            ></TextField>
            <Grid container alignItems="center" justifyContent="center" direction="column">
              <Button variant="contained" size="large" type="submit">
                Login
              </Button>
            </Grid>
          </form>
        </Grid>
        <Grid container alignItems="center" justifyContent="center" direction="column">
          <form
            method="get"
            action={`${API.CONFIGS.baseURL}${API.ENDPOINT.AUTHENTICATION.GOOGLE_LOGIN}`}
          >
            <Button
              startIcon={<Google />}
              variant="contained"
              size="large"
              type="submit"
              sx={{ marginTop: MARGIN, marginBottom: MARGIN }}
            >
              Login with Google
            </Button>
          </form>
        </Grid>
      </Grid>
    </Card>
  );
};

export default Login;
