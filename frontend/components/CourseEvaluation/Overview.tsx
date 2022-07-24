import * as React from 'react';
import type { NextPage } from 'next';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, Container, Stack } from '@mui/material';

const Overview: NextPage = () => {  
    return (
    <Container>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ maxWidth: 300, backgroundColor: '#0E91AC', color: 'white', p: 1 }}>
            <Typography variant="subtitle2">INFORMATION</Typography>
          </Card>
          <Card sx={{ height: 400, overflow: 'auto' }}>
            <Typography sx={{ p: 1, fontWeight: 'bold' }}>
              Review Target Due Date:
              <Typography variant="subtitle2">24th july 2022</Typography>
            </Typography>
            <Typography sx={{ p: 1, fontWeight: 'bold' }}>
              Course Description:
              <Typography variant="subtitle2">
                qwertyudsgfvemhjblvjisrhnvlijrsvnfdcdkmvbrjlgbrjvbdjlvhnsrljhgrvnfjk-view-general-information-page
                2df26e4 fixed code4 files changed, 151 insertionsrename frontend/componentsdelete
                mode 100644 frontend/pages/coordinator-general.tsxcreate mode 100644 fronten
              </Typography>
            </Typography>
            <Typography sx={{ p: 1, fontWeight: 'bold' }}>
              Coordinators:
              <Typography variant="subtitle2">
                <List sx={{ listStyleType: 'disc' }}>
                  <ListItem>Frinze</ListItem>
                  <ListItem>Michael</ListItem>
                </List>{' '}
              </Typography>
            </Typography>
            <Typography sx={{ p: 1, fontWeight: 'bold' }}>
              Date Started:
              <Typography variant="subtitle2">10th july 2022</Typography>
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ maxWidth: 300, backgroundColor: '#0E91AC', color: 'white', p: 1 }}>
            <Typography variant="subtitle2">DOCUMENTS</Typography>
          </Card>
          <Card sx={{ minHeight: 400, overflow: 'auto' }}></Card>
        </Grid>
      </Grid>
      <Box sx={{ p: 2 }}>
        <Card sx={{ maxWidth: 300, backgroundColor: '#0E91AC', color: 'white', p: 1 }}>
          <Typography variant="subtitle2">QUICK ACTIONS</Typography>
        </Card>
        <Card>
          <CardContent>
            <Stack spacing={5} direction="row">
              <Button variant="contained" sx={{ backgroundColor: '#00BCD4' }}>
                MARK AS COMPLETED
              </Button>
              <Button variant="contained" sx={{ backgroundColor: '#00BCD4' }}>
                EDIT EVALUATION
              </Button>
              <Button variant="contained" sx={{ backgroundColor: '#00BCD4' }}>
                MANAGE REVIEWERS
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Overview;
