import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Image from 'next/image';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ArticleIcon from '@mui/icons-material/Article';
import LoginIcon from '@mui/icons-material/Login';

import SHLLogo from 'public/shl.png';
import Link from 'next/link';

const Header = () => {

  return (
    <AppBar
      position="sticky"
      sx={{
        marginBottom: 10,
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/">
            <a>
              <Box
                sx={{
                  padding: 1,
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                }}
              >
                <Image src={SHLLogo} height={40} width={40} alt="shl_logo" />
                <Typography
                  variant="h6"
                  noWrap
                  component="a"
                  href="/"
                  sx={{
                    marginLeft: 1,
                  }}
                >
                  IndEAAv2
                </Typography>
              </Box>
            </a>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'end' }}>
            <Button
              variant="contained"
              startIcon={<ArticleIcon />}
              href="https://indeaa-docs.systemhealthlab.com/"
              target="_blank"
              color="secondary"
              sx={{ mr: 1 }}
            >
              Documentation
            </Button>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={() => console.log('a')}
              color="secondary"
              sx={{ mr: 1 }}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
