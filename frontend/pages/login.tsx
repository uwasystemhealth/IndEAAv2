import AppContext from '@/components/Context/TopLevelContext';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import API from 'utils/api';
import * as yup from 'yup';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import Button from '@mui/material/Button';
import LoginIcon from '@mui/icons-material/Login';
import Alert from '@mui/material/Alert';
import axios from 'axios';
import { determineIfUserIsAuthentication } from 'utils/Authentication';
import { Google } from '@mui/icons-material';
import CsrfToken, { getCookie } from '@/components/Authentication/CsrfToken';
import { headers } from 'next.config';
import cookie from 'react-cookies';

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

  const [csrfMiddlewareToken, setCsrfMiddlewareToken] = useState<string>('ERROR');
  useEffect(() => {
    const getToken = async () => {
      const response = await API.CLIENT.get(API.ENDPOINT.AUTHENTICATION.GOOGLE_LOGIN);
      if (response.data.body) {
        const token: string = response.data.body.children[0].value;
        setCsrfMiddlewareToken(token);
        console.log(token);
      }
    };

    getToken();
  }, []);

  const test = async (csrf: string, csrfmiddleware: string) => {
    console.log(csrf);

    // const csrf_middleware_token = await API.CLIENT.get(API.ENDPOINT.AUTHENTICATION.GOOGLE_LOGIN);
    // console.log(csrf_middleware_token);
    axios.defaults.withCredentials = true;

    await API.CLIENT.post(
      API.ENDPOINT.AUTHENTICATION.GOOGLE_LOGIN,
      { csrfmiddlewaretoken: csrfmiddleware },
      {
        headers: {
          'X-CSRFTOKEN': csrf,
        },
      },
    );
  };

  return (
    <>
      {cookie.load('csrftoken')}
      <form onSubmit={formik.handleSubmit}>
        {LoggedInErrored && <Alert severity="error">{LoggedInErrored}</Alert>}
        <TextField
          fullWidth
          label="Email"
          id="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          sx={{
            marginBottom: '1rem',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            ),
          }}
        ></TextField>
        <TextField
          fullWidth
          label="Password"
          id="password"
          type={'password'}
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          sx={{
            marginBottom: '1rem',
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PasswordIcon />
              </InputAdornment>
            ),
          }}
        ></TextField>
        <Button startIcon={<LoginIcon />} variant="contained" size="large" type="submit">
          Login
        </Button>
      </form>
      <hr />
      <form onSubmit={() => test(cookie.load('csrftoken'), csrfMiddlewareToken)}>
        <input type="hidden" name="csrfmiddlewaretoken" value={'TESTING'} />
        <Button startIcon={<Google />} variant="contained" size="large" type="submit">
          Login with Google
        </Button>
      </form>
    </>
  );
};

export default Login;
