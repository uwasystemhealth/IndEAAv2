import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import Header from '@/components/utils/Header';
import CustomTheme from '@/components/utils/CustomTheme';
import { AppProvider } from '@/components/Context/TopLevelContext';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppProvider>
      <ThemeProvider theme={CustomTheme}>
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </AppProvider>
  );
}

export default MyApp;
