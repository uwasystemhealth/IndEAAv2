// This file contains everything related to the Context "global state"

import React, { createContext, useState, useMemo, useEffect } from 'react';
import { API_ENDPOINT } from '../../utils/api';
import { isTokenExpired } from '../../utils/Authentication';
import useAuthenticatedAPIClient from '../hooks/useAuthenticatedAPIClient';

interface AuthenticationDetailsInterface {
  accessToken: string;
  refreshToken: string;
}
interface ContextProps {
  authenticationDetails: AuthenticationDetailsInterface;
  setAuthenticationDetails: (authenticationDetails: AuthenticationDetailsInterface) => void;
}

const initialAuthenticationDetails: AuthenticationDetailsInterface = {
  accessToken: '',
  refreshToken: '',
};

const AppContext = createContext<ContextProps>({
  authenticationDetails: initialAuthenticationDetails,
  setAuthenticationDetails: () => {},
});

interface Props {
  children: React.ReactNode;
}

// Component System of Provider
export const AppProvider = ({ children }: Props) => {
  const axios = useAuthenticatedAPIClient();
  /*
  Set the initial authentication details from the localStorages:
  - access-token
  - refresh-token

  Note: Only do this when it is client-side
  */
  if (typeof document !== 'undefined') {
    // Get from the localStorage
    const accessToken = localStorage.getItem('access-token') || '';
    const refreshToken = localStorage.getItem('refresh-token') || '';

    // Set the initial authentication details
    initialAuthenticationDetails.accessToken = accessToken;
    initialAuthenticationDetails.refreshToken = refreshToken;
  }

  // Authentication States
  const [authenticationDetails, setAuthenticationDetails] = useState(initialAuthenticationDetails);

  useEffect(() => {
    /*
        On mount of this component it will check whether this is a new user, or a user that we have to reauthenticate
       */
    const attemptToReauthenticate = async () => {
      if (
        // Refresh the token every time when expired
        isTokenExpired(authenticationDetails.accessToken) &&
        authenticationDetails.refreshToken
      ) {
        // If it is expired, then we need to refresh the token
        const { data: tokenData } = await axios.post(API_ENDPOINT.AUTHENTICATION.REFRESH, {
          refresh: authenticationDetails.refreshToken,
        });
        // Replace the old access token with the new access token
        localStorage.setItem('access-token', tokenData.accessToken);
        setAuthenticationDetails({
          accessToken: tokenData.access,
          refreshToken: authenticationDetails.refreshToken,
        });
      }
    };
    attemptToReauthenticate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // This one is a one-time thing onmount, this should not run anymore so no dependency needed for this

  const contextValue = useMemo(
    () => ({
      authenticationDetails,
      setAuthenticationDetails,
    }),
    [authenticationDetails],
  );

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};
export const AppConsumer = AppContext.Consumer;
export default AppContext;
