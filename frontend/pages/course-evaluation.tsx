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
import Listings from '@/components/course-listings/listings';

const testing: NextPage = () => {
  // to get url parameter
  // const search = window.location.search;
  // const params = new URLSearchParams(search);
  // const foo = params.get('id');
  // console.log(foo);

  return (
    <Container>
      <Card>
        <Typography>hello</Typography>
      </Card>
    </Container>
  );
};

export default testing;
