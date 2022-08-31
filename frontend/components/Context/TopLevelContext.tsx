// This file contains everything related to the Context "global state"

import React, { createContext, useState, useMemo, useEffect } from 'react';
import { API_CLIENT, API_ENDPOINT } from '../../utils/api';
import { isTokenExpired } from '../../utils/Authentication';

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
  authenticationDetails: {
    accessToken: '',
    refreshToken: '',
  },
  setAuthenticationDetails: () => {},
});

interface Props {
  children: React.ReactNode;
}

// Component System of Provider
export const AppProvider = ({ children }: Props) => {
  /*
  Set the initial authentication details from the localStorages:
  - access-token
  - refresh-token

  Note: Only do this when it is client-side
  */
  // Authentication States
  const [authenticationDetails, setAuthenticationDetails] = useState({
    accessToken: '',
    refreshToken: '',
  });

  useEffect(() => {
    /*
      On mount of this try to authenticate the user
    */
    // Get from the localStorage
    const accessToken = localStorage.getItem('access-token') || '';
    const refreshToken = localStorage.getItem('refresh-token') || '';

    // Set the initial authentication details
    initialAuthenticationDetails.accessToken = accessToken;
    initialAuthenticationDetails.refreshToken = refreshToken;

    const attemptToReauthenticate = async () => {
      if (
        // Refresh the token every time when expired
        isTokenExpired(initialAuthenticationDetails.accessToken) &&
        initialAuthenticationDetails.refreshToken
      ) {
        // If it is expired, then we need to refresh the token
        const { data: tokenData } = await API_CLIENT.post(API_ENDPOINT.AUTHENTICATION.REFRESH, {
          refresh: initialAuthenticationDetails.refreshToken,
        });
        // Replace the old access token with the new access token
        localStorage.setItem('access-token', tokenData.accessToken);
        setAuthenticationDetails({
          accessToken: tokenData.access,
          refreshToken: initialAuthenticationDetails.refreshToken,
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
