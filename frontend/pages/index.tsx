import React from 'react';
import { useSWRAuth } from '@/components/hooks/useSWRAuth';
import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { API_ENDPOINT } from 'utils/api';
import { useContext } from 'react';
import AppContext from 'components/Context/TopLevelContext';
import { determineIfUserIsAuthentication } from 'utils/Authentication';
import Listings from '@/components/CourseListings/Listings';

const Home: NextPage = () => {
  // Change these data when this issue gets worked on. For now it just contains a demo of how to get user info
  const { response, isLoading, error } = useSWRAuth(API_ENDPOINT.COURSE_EVALUATION.LIST);

  const { authenticationDetails, setAuthenticationDetails } = useContext(AppContext);
  const isUserAuthenticated = determineIfUserIsAuthentication(authenticationDetails.accessToken);

  return (
    <Container>
      {!isUserAuthenticated ? (
        <Card>
          <CardContent
            sx={{
              minHeight: '50vh',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: 36 }} color="text.secondary" gutterBottom>
                Welcome!
              </Typography>
              <Typography variant="body2">Please Login to continue</Typography>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Listings />
      )}
    </Container>
  );
};

export default Home;
