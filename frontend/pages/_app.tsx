import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import image from 'public/bg7.png';
import Header from '@/components/utils/Header';
import CustomTheme from '@/components/utils/CustomTheme';
import { AppProvider } from '@/components/Context/TopLevelContext';

function MyApp({ Component, pageProps }: AppProps) {
  const myStyle={
    backgroundImage: 
"url('https://raw.githubusercontent.com/uwasystemhealth/IndEAA/develop/client/assets/img/bg7.jpg')", //'url(' + image + ')' won't work
    height:'100vh',
    marginTop:'-100px',
    backgroundSize: 'cover',

};
  return (
    <AppProvider>
      <ThemeProvider theme={CustomTheme}>
        <Header />
        <div style={myStyle}>    
        <Component {...pageProps} />
        
        </div>
      </ThemeProvider>
    </AppProvider>
  );
}

export default MyApp;
