import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import image from 'public/bg7.png';
import Header from '@/components/utils/Header';
import CustomTheme from '@/components/utils/CustomTheme';
import { AppProvider } from '@/components/Context/TopLevelContext';

function MyApp({ Component, pageProps }: AppProps) {
  const myStyle = {
    backgroundImage: `url("${image.src}")`,
    minHeight: '100vh',
    backgroundSize: 'cover',
  };
  return (
    <AppProvider>
      <ThemeProvider theme={CustomTheme}>
        <div style={myStyle}>
          <Header />
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </AppProvider>
  );
}

export default MyApp;
