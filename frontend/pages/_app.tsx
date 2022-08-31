import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
// eslint-disable-next-line import/extensions
import image from 'public/bg7.png';
import { useEffect } from 'react';
import { hotjar } from 'react-hotjar';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import Header from '@/components/utils/Header';
import CustomTheme from '@/components/utils/CustomTheme';
import { AppProvider } from '@/components/Context/TopLevelContext';
import createEmotionCache from '@/components/utils/createEmotionCache';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  // eslint-disable-next-line react/require-default-props
  emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
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
    <CacheProvider value={emotionCache}>
      <AppProvider>
        <ThemeProvider theme={CustomTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <div style={myStyle}>
            <Header />
            {/* This is the usual structure. This linting is an exception */}
            {/* eslint-disable-next-line react/jsx-props-no-spreading */}
            <Component {...pageProps} />
          </div>
        </ThemeProvider>
      </AppProvider>
    </CacheProvider>
  );
};

export default MyApp;
