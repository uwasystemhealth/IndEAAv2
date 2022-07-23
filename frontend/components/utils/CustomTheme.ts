import { createTheme } from '@mui/material/styles';

const { palette } = createTheme();
const CustomTheme = createTheme({
  palette: {
    primary: {
      main: '#F68C2C',
      contrastText: '#fff',
    },
    secondary: {
      main: '#01ab8b',
      contrastText: '#fff',
    },
    info: {
      main: '#0e91ac',
      contrastText: '#fff',
    },
    success: {
      main: '#b3de68',
      contrastText: '#fff',
    },
    error: {
      main: '#eb053a',
      contrastText: '#fff',
    },
  },
});

export default CustomTheme;
