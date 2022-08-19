import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import image from 'public/bg7.png';
import { useEffect } from 'react';
import { hotjar } from 'react-hotjar';
import Header from '@/components/utils/Header';
import CustomTheme from '@/components/utils/CustomTheme';
import { AppProvider } from '@/components/Context/TopLevelContext';

const MyApp = ({ Component, pageProps }: AppProps) => {
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
          {/* This is the usual structure. This linting is an exception */}
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <Component {...pageProps} />
        </div>
      </ThemeProvider>
    </AppProvider>
  );
};

export default MyApp;
