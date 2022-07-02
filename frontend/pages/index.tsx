import { useSWRAuth } from '@/components/hooks/useSWRAuth';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
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
    <div>
      <p>isLoading: {`${isLoading}`}</p>
      <p>error: {`${error}`}</p>
      {pk && (
        <div>
          <p>pk: {pk}</p>
          <p>username: {username}</p>
          <p>email: {email}</p>
          <p>firstName: {firstName}</p>
          <p>lastName: {lastName}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
