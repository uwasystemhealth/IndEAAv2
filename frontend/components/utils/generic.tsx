/* eslint-disable import/prefer-default-export */
import { Coordinator, UserAPIResponse } from 'utils/api';

export const userDisplayName = (user: UserAPIResponse | Coordinator) => {
  const { email, first_name: firstName, last_name: lastName } = user;
  return `${firstName} ${lastName} (${email})`;
};

export const listOfUserDisplayNames = (users: UserAPIResponse[] | Coordinator[]) =>
  users.map(userDisplayName).join(', ');
