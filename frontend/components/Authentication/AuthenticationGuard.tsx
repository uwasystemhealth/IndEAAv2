import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import AppContext from 'components/Context/TopLevelContext';
import { determineIfUserIsAuthentication } from 'utils/Authentication';

interface Props {
  children: React.ReactNode;
}

const AuthenticationGuard = (props: Props) => {
  // This component is about making sure user is logged in before rendering the children
  // Surround your component with this component, if you want to use this component

  const router = useRouter();

  const { children } = props;

  //   Get token from context
  const { authenticationDetails } = useContext(AppContext);
  const is_authenticated = determineIfUserIsAuthentication(authenticationDetails.accessToken);
  //   Redirect to login page if user is not logged in (only do that when this is being run in the browser)
  if (typeof window !== 'undefined' && !is_authenticated) {
    router.push('/login');
  }

  return <div>{is_authenticated ? children : null}</div>;
};

export default AuthenticationGuard;
