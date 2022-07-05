import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
//import image from 'public/bg7.png';
import Header from '@/components/utils/Header';
import CustomTheme from '@/components/utils/CustomTheme';
import { AppProvider } from '@/components/Context/TopLevelContext';

function MyApp({ Component, pageProps }: AppProps) {
  const myStyle={
    backgroundImage: 
"url('https://raw.githubusercontent.com/uwasystemhealth/IndEAA/develop/client/assets/img/bg7.jpg')",
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
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{backgroundColor: 'Lightgray', textAlign: 'center', height: 200, width: 800}}>
          <h1>Welcome</h1>
          <p>Please login to select your role</p>
        </div>
        </div>
        </div>
      </ThemeProvider>
    </AppProvider>
  );
}

export default MyApp;
