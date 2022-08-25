import React, { useContext } from 'react';
import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import AppContext from 'components/Context/TopLevelContext';
import { determineIfUserIsAuthentication } from 'utils/Authentication';
import Listings from '@/components/CourseListings/Listings';

const StaticInformationAboutIndEAA = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      textAlign: 'center',
    }}
  >
    <Box>
      <Typography sx={{ fontSize: 36 }} color="text.secondary" gutterBottom>
        Welcome to IndEAAv2!
      </Typography>
      <Typography variant="body2">
        IndEAA (Industrial Engineer Australia Assessment) is web application that streamlines course
        review by Industry Advisory Panels by centralising all the information that is related to
        the review in one place. More information about IndEAA in the documentation.
      </Typography>
    </Box>
  </Box>
);

const Home: NextPage = () => {
  const { authenticationDetails } = useContext(AppContext);
  const isUserAuthenticated = determineIfUserIsAuthentication(authenticationDetails.accessToken);

  return (
    <Container maxWidth="xl">
      <Card>
        <CardContent
          sx={{
            minHeight: '50vh',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          {!isUserAuthenticated ? <StaticInformationAboutIndEAA /> : <Listings />}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
