import { useSWRAuth } from '@/components/hooks/useSWRAuth';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { API_ENDPOINT, DEFAULT_USER_API_RESPONSE, UserAPIResponse } from 'utils/api';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  // Change these data when this issue gets worked on. For now it just contains a demo of how to get user info
  const { response, isLoading, error } = useSWRAuth(API_ENDPOINT.AUTHENTICATION.USER);
  const {
    pk,
    username,
    email,
    first_name: firstName,
    last_name: lastName,
  } = (response?.data as unknown as UserAPIResponse) || DEFAULT_USER_API_RESPONSE;
  return (  
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justify="center"
      style={{ minHeight: '100vh', paddingTop: '120px'}}
    >
      <Card style={{opacity: 0.8, width: '70%'}}>
        <Grid sx={{minWidth: 500, minHeight: 250}} container alignItems="center" justifyContent="center">
        <CardContent>
          <Typography sx={{ fontSize: 36 }} color="text.secondary" gutterBottom>
            Welcome!
          </Typography>
          <Typography variant="body2">
            Please Login to continue
          </Typography>
        </CardContent>
        </Grid>
      </Card>
    </Grid>
    
    
    // <div>
    //   <p>isLoading: {`${isLoading}`}</p>
    //   <p>error: {`${error}`}</p>
    //   {pk && (
    //     <div>
    //       <p>pk: {pk}</p>
    //       <p>username: {username}</p>
    //       <p>email: {email}</p>
    //       <p>firstName: {firstName}</p>
    //       <p>lastName: {lastName}</p>
    //     </div>
    //   )}
    // </div>
  );
};

export default Home;
