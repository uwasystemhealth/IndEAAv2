import * as React from 'react';
import { useSWRAuth } from '@/components/hooks/useSWRAuth';
import type { NextPage } from 'next';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { API_ENDPOINT, DEFAULT_USER_API_RESPONSE, UserAPIResponse } from 'utils/api';
import styles from '../styles/Home.module.css';
import { useContext } from 'react';
import { useRouter } from 'next/router';
import AppContext from 'components/Context/TopLevelContext';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import { determineIfUserIsAuthentication } from 'utils/Authentication';


const Overview: NextPage = () => {
  // Change these data when this issue gets worked on. For now it just contains a demo of how to get user info
  const { response, isLoading, error } = useSWRAuth(API_ENDPOINT.AUTHENTICATION.USER);
  const {
    pk,
    username,
    email,
    first_name: firstName,
    last_name: lastName,
  } = (response?.data as unknown as UserAPIResponse) || DEFAULT_USER_API_RESPONSE;

  const router = useRouter();
  const axios = useAuthenticatedAPIClient();
  const { authenticationDetails, setAuthenticationDetails } = useContext(AppContext);
  const isUserAuthenticated = determineIfUserIsAuthentication(authenticationDetails.accessToken);

  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (  
    <Grid style={{ minHeight: '100vh'}}>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Paper sx={{minHeight: 400}}>Information</Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper sx={{minHeight: 400}}>Documents</Paper>
        </Grid>
        <Grid container spacing={0} direction="column" alignItems="center" justify="center" sx={{padding: 5}}>
        <Card sx={{minWidth: 1000}}>
            <CardContent>
                <Typography>
                    Buttons
                </Typography>
            </CardContent>
            
        </Card>
        </Grid>
      </Grid>
        
    </Grid>
  );
};

export default Overview;
