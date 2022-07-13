import React from 'react';
import { useSWRAuth } from '@/components/hooks/useSWRAuth';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import {
  API_ENDPOINT,
  CourseEvaluationListEntry,
  DEFAULT_COURSE_EVALUATION_LIST_ENTRY,
  DEFAULT_USER_API_RESPONSE,
  UserAPIResponse,
} from 'utils/api';
import styles from '../styles/Home.module.css';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import AppContext from 'components/Context/TopLevelContext';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import { determineIfUserIsAuthentication } from 'utils/Authentication';

const Home: NextPage = () => {
  // Change these data when this issue gets worked on. For now it just contains a demo of how to get user info
  const { response, isLoading, error } = useSWRAuth(API_ENDPOINT.COURSE_EVALUATION.LIST);
  const hold = ((response?.data as unknown) || []) as CourseEvaluationListEntry[];
  // console.log(hold.)
  const [role, setRole] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };
  const router = useRouter();
  const axios = useAuthenticatedAPIClient();
  const { authenticationDetails, setAuthenticationDetails } = useContext(AppContext);
  const isUserAuthenticated = determineIfUserIsAuthentication(authenticationDetails.accessToken);

  return (
    <div>
      {!isUserAuthenticated ? (
        <Container>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
              }}
            >
              <Typography sx={{ fontSize: 36 }} color="text.secondary" gutterBottom>
                Welcome!
              </Typography>
              <Typography variant="body2">Please Login to continue</Typography>
            </CardContent>
          </Card>
        </Container>
      ) : (
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: '100vh', paddingTop: '120px' }}
        >
          <Card style={{ width: '70%' }}>
            <Grid
              sx={{ minWidth: 500, maxHeight: 70, backgroundColor: 'darkOrange' }}
              container
              alignItems="center"
              justifyContent="center"
            >
              <CardContent>
                <Typography sx={{ fontSize: 36 }} color="text.secondary" gutterBottom>
                  Welcome!
                </Typography>
              </CardContent>
            </Grid>
          </Card>
          <Card style={{ opacity: 0.8, width: '70%' }}>
            <Grid
              sx={{ minWidth: 500, minHeight: 250 }}
              container
              alignItems="center"
              justifyContent="center"
            >
              <CardContent>
                <Typography sx={{ fontSize: 24 }} variant="body2">
                  Please Choose your Role
                </Typography>
                <br></br>
                <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Role</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={role}
                      label="Role"
                      onChange={handleChange}
                    >
                      <MenuItem value={10}>Coordinator</MenuItem>
                      <MenuItem value={20}>Reviewer</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </CardContent>
            </Grid>
          </Card>
        </Grid>
      )}
    </div>
  );
};

export default Home;
