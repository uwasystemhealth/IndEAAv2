import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Image from 'next/image';
import Typography from '@mui/material/Typography';

import SHLLogo from 'public/shl.png';
import Link from 'next/link';

const Header = () => (
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
              }}
            >
              <Image src={SHLLogo} height={40} width={40} alt="shl_logo" />
            </Box>
          </a>
        </Link>
        <Typography variant="h6" noWrap component="a" href="/">
          IndEAAv2
        </Typography>
      </Toolbar>
    </Container>
  </AppBar>
);

export default Header;
