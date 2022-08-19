export const isTokenExpired = (token: String) => {
  // This determines if the token is expired or not
  //   source: https://stackoverflow.com/questions/51292406/jwt-check-if-token-expired
  try {
    return (
      Date.now() >= JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString()).exp * 1000
    );
  } catch (e) {
    return true;
  }
};

export const determineIfUserIsAuthentication = (token: String) =>
  // This determines if the user is authenticated or not
  token && !isTokenExpired(token);
