import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArticleIcon from '@mui/icons-material/Article';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
// eslint-disable-next-line import/extensions
import SHLLogo from 'public/shl.png';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import AppContext from 'components/Context/TopLevelContext';
import { determineIfUserIsAuthentication } from 'utils/Authentication';
import API from 'utils/api';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import Fab from '@mui/material/Fab';

const Header = () => {
  const router = useRouter();
  const axios = useAuthenticatedAPIClient();
  const { authenticationDetails, setAuthenticationDetails } = useContext(AppContext);
  const isUserAuthenticated = determineIfUserIsAuthentication(authenticationDetails.accessToken);

  const handleLogin = () => {
    router.push('/login');
  };

  const handleLogout = () => {
    setAuthenticationDetails({
      accessToken: '',
      refreshToken: '',
    });
    localStorage.removeItem('access-token');
    localStorage.removeItem('refresh-token');

    axios.post(API.ENDPOINT.AUTHENTICATION.LOGOUT);
    router.push('/login');
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        marginBottom: 10,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/">
            {/* NextJS automatically prefils the href for the anchor */}
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>
              <Box
                sx={{
                  padding: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Image src={SHLLogo} height={40} width={40} alt="shl_logo" />
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    marginLeft: 1,
                  }}
                >
                  IndEAAv2
                </Typography>
              </Box>
            </a>
          </Link>
          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'end' }}>
            <Button
              variant="contained"
              startIcon={<ArticleIcon />}
              href="https://indeaav2-docs.systemhealthlab.com/"
              target="_blank"
              color="secondary"
              sx={{ mr: 1, display: { xs: 'none', md: 'inherit' } }}
            >
              Documentation
            </Button>
            <Fab
              href="https://indeaav2-docs.systemhealthlab.com/"
              target="_blank"
              color="secondary"
              sx={{ mr: 1, display: { xs: 'inherit', md: 'none' } }}
            >
              <ArticleIcon />
            </Fab>
            <Button
              variant="contained"
              startIcon={isUserAuthenticated ? <LogoutIcon /> : <LoginIcon />}
              onClick={isUserAuthenticated ? handleLogout : handleLogin}
              color="secondary"
              sx={{ mr: 1, display: { xs: 'none', md: 'inherit' } }}
            >
              {isUserAuthenticated ? 'Logout' : 'Login'}
            </Button>
            <Fab
              onClick={isUserAuthenticated ? handleLogout : handleLogin}
              color="secondary"
              sx={{ mr: 1, display: { xs: 'inherit', md: 'none' } }}
            >
              {isUserAuthenticated ? <LogoutIcon /> : <LoginIcon />}
            </Fab>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
