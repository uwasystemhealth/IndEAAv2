import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import image from 'public/bg7.png';
import Header from '@/components/utils/Header';
import CustomTheme from '@/components/utils/CustomTheme';
import { useEffect } from 'react';
import { AppProvider } from '@/components/Context/TopLevelContext';
import { hotjar } from 'react-hotjar';

function MyApp({ Component, pageProps }: AppProps) {
  const myStyle = {
    backgroundImage: `url("${image.src}")`,
    minHeight: '100vh',
    backgroundSize: 'cover',
  };

  useEffect(() => {
    hotjar.initialize(
      parseInt(process.env.NEXT_PUBLIC_HOTJAR_ID || '', 10),
      parseInt(process.env.NEXT_PUBLIC_HOTJAR_SFV || '', 10),
    );
  }, []);

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
