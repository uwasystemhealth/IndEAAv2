import React, { useContext } from 'react';
import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppContext from 'components/Context/TopLevelContext';
import { determineIfUserIsAuthentication } from 'utils/Authentication';
import Listings from '@/components/CourseListings/Listings';
import BodyCard from '@/components/utils/BodyCard';

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
    <BodyCard>{!isUserAuthenticated ? <StaticInformationAboutIndEAA /> : <Listings />}</BodyCard>
  );
};

export default Home;
