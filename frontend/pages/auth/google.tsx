import AppContext from '@/components/Context/TopLevelContext';
import { useRouter } from 'next/router';
import { useState, useEffect, useContext } from 'react';
import API from 'utils/api';

type Props = {};

const Google = (props: Props) => {
  const router = useRouter();
  const { authenticationDetails, setAuthenticationDetails } = useContext(AppContext);
  const [LoggedInErrored, setLoggedInErrored] = useState('');
  const [pageURL, setPageURL] = useState('');
  useEffect(() => {
    setPageURL(window.location.href);
  });

  const code = new URLSearchParams(pageURL).get('code') || 'ERROR'; // TODO: Error handling

  (async (code: string) => {
    try {
      const { data } = await API.CLIENT.post(API.ENDPOINT.AUTHENTICATION.GOOGLE_TOKEN, {
        code: code,
      });
      const { access_token: accessToken, refresh_token: refreshToken } = data;
      // Set access_token and refresh_token in localstorage. Rip off login.tsx
      localStorage.setItem('access-token', accessToken);
      localStorage.setItem('refresh-token', refreshToken);
      setAuthenticationDetails({
        accessToken,
        refreshToken,
      });
      setLoggedInErrored('');
      router.push('/');
    } catch (error) {
      console.error(error);
      return {};
    }
  })(code);

  return (
    <>
      <h1>{pageURL}</h1>
      {/* <h1>{code}</h1> */}
      <h1>
        {authenticationDetails.accessToken}, {authenticationDetails.refreshToken}
      </h1>
    </>
  );
};

export default Google;
