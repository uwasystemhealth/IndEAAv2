// This contains the custom hook for authenticated API calls

import API from 'utils/api';
import { useContext } from 'react';
import AppContext from 'components/Context/TopLevelContext';
import { determineIfUserIsAuthentication } from 'utils/Authentication';

const useAuthenticatedAPIClient = () => {
  // Gets the context `authentication_details` and binds that to the API client

  const { authenticationDetails } = useContext(AppContext);
  if (determineIfUserIsAuthentication(authenticationDetails.accessToken)) {
    // Set only if it exist
    API.CLIENT.defaults.headers.common.Authorization = `Bearer ${authenticationDetails.accessToken}`;
  }
  return API.CLIENT;
};

export default useAuthenticatedAPIClient;
