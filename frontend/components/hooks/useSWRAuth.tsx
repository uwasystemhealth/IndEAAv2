// This contains all the custom hooks to integrate with the API
import useSWR from 'swr';
import useAuthenticatedAPIClient from 'components/hooks/useAuthenticatedAPIClient';
import AppContext from 'components/Context/TopLevelContext';
import { useContext } from 'react';
import { isTokenExpired } from 'utils/Authentication';

/**
 * GET SWR values
 * Note: This custom hook will get the value depending on the conditions on
 * `accessToken` and `checkTokenBeforeQuerying`
 */
const useSWRAuth = (url: string | null, checkTokenBeforeQuerying = true, config = {}) => {
  const { authenticationDetails } = useContext(AppContext);

  const axios = useAuthenticatedAPIClient();

  const shouldGetValue = checkTokenBeforeQuerying
    ? !isTokenExpired(authenticationDetails.accessToken)
    : true;

  const swrValues = useSWR(shouldGetValue ? url : null, axios, config);
  return { ...swrValues, isLoading: !swrValues.data && !swrValues.error, response: swrValues.data };
};

export default useSWRAuth;
