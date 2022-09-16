/* eslint-disable import/prefer-default-export */
import { User } from 'utils/api';

export const userDisplayName = (user: User) => {
  const { email, first_name: firstName, last_name: lastName } = user;
  return `${firstName} ${lastName} (${email})`;
};

export const listOfUserDisplayNames = (users: User[]) => users.map(userDisplayName).join(', ');
