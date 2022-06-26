import AppContext from 'components/Context/TopLevelContext';
import React, { useContext } from 'react';
import { SWRConfig } from 'swr';

import API from 'utils/api';

interface Props {
  children: React.ReactNode;
}

const SWRAuthenticatedConfigWrapper = (props: Props) => {
  const { authenticationDetails } = useContext(AppContext);
  API.CLIENT.defaults.headers.common.Authorization = `Bearer ${authenticationDetails.accessToken}`;

  const { children } = props;
  return (
    <SWRConfig
      value={{
        fetcher: async (url) => {
          const response = await API.CLIENT.get(url);
          return response.data;
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWRAuthenticatedConfigWrapper;
