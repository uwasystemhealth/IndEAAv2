import React, { useContext } from 'react';
import AppContext from 'components/Context/TopLevelContext';

interface Props {
  children: React.ReactNode;
}

const PermissionGuard = (props: Props) => (
  // This component is responsible for checking if the user has the permission to access the page
  //   This is similar to `AuthenticationGuard` component, except give this a prop `groups_that_can_access` to check if the user has the permission to access the page

  <>PlaceHolder</>
);
export default PermissionGuard;
