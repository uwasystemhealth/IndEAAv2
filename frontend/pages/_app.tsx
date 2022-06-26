import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import Header from '@/components/utils/Header';
import CustomTheme from '@/components/utils/CustomTheme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={CustomTheme}>
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
