import AppContext from '@/components/Context/TopLevelContext';
import { Box, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import API from 'utils/api';

// eslint-disable-next-line @typescript-eslint/naming-convention
enum LOGIN_STATE {
  START,
  REQUEST,
  ERROR,
  SUCCESS,
}

const Google = () => {
  const router = useRouter();
  const { setAuthenticationDetails } = useContext(AppContext);
  const [loggedInErrored, setLoggedInErrored] = useState('');
  const [state, setState] = useState(LOGIN_STATE.START);

  useEffect(() => {
    const pageURLParams = new URL(window.location.href).search;
    const code = new URLSearchParams(pageURLParams).get('code');

    if (code) {
      setState(LOGIN_STATE.REQUEST);

      const loginWithGoogleToken = async () => {
        try {
          const { data } = await API.CLIENT.post(API.ENDPOINT.AUTHENTICATION.GOOGLE_TOKEN, {
            code,
          });
          const { access_token: accessToken, refresh_token: refreshToken } = data;
          // Set access_token and refresh_token in localstorage.
          localStorage.setItem('access-token', accessToken);
          localStorage.setItem('refresh-token', refreshToken);
          setAuthenticationDetails({
            accessToken,
            refreshToken,
          });
          setLoggedInErrored('');
          setState(LOGIN_STATE.SUCCESS);
          router.push('/');
        } catch (e) {
          setState(LOGIN_STATE.ERROR);
          if (e instanceof AxiosError) {
            setLoggedInErrored(`Error ${e.code}. Message ${e.message}. Cause ${e.cause}`);
          } else {
            setLoggedInErrored('Unknown error.');
          }
        }
      };

      loginWithGoogleToken();
    } else {
      setState(LOGIN_STATE.ERROR);
      setLoggedInErrored('No code received, cannot authenticate.');
    }
  }, [router, setAuthenticationDetails]);

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: '0',
        right: '0',
      }}
    >
      <Typography
        sx={{ justifyContent: 'flex-end' }}
        color={state === LOGIN_STATE.ERROR ? 'error.main' : 'info.main'}
      >
        {state === LOGIN_STATE.ERROR ? loggedInErrored : 'Please wait, logging in . . .'}
      </Typography>
    </Box>
  );
};

export default Google;
