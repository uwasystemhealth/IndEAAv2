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
import CardHeader from '@mui/material/CardHeader';
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
import Button from '@mui/material/Button';

const Home: NextPage = () => {
  // Change these data when this issue gets worked on. For now it just contains a demo of how to get user info
  const { response, isLoading, error } = useSWRAuth(API_ENDPOINT.COURSE_EVALUATION.LIST);
  const courseEvaluationListEntries = ((response?.data as unknown) ||
    []) as CourseEvaluationListEntry[];
  const [role, setRole] = React.useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };
  const router = useRouter();
  const axios = useAuthenticatedAPIClient();
  const { authenticationDetails, setAuthenticationDetails } = useContext(AppContext);
  const isUserAuthenticated = determineIfUserIsAuthentication(authenticationDetails.accessToken);

  return (
    <Container>
      <Card>
        <CardContent
          sx={{
            minHeight: '50vh',
          }}
        >
          {!isUserAuthenticated ? (
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
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
              }}
            >
              {courseEvaluationListEntries.map((courseEvaluationListEntry) => (
                <Card key={courseEvaluationListEntry.id}>
                  <CardContent>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box>
                        <Typography gutterBottom variant="h5" component="div">
                          {courseEvaluationListEntry.unit_code}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {courseEvaluationListEntry.description}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        <Button>View</Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default Home;
