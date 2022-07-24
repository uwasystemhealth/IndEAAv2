import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, Container, Stack } from '@mui/material';
import { CourseEvaluationListEntry } from 'utils/api';
import CustomTheme from '../utils/CustomTheme';

type Props = {
  evaluation: CourseEvaluationListEntry;
};

function Overview({ evaluation }: Props) {

  return (
    <Container>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ maxWidth: 300, backgroundColor: CustomTheme.palette.info.main, color: 'white', p: 1 }}>
            <Typography variant="subtitle2">INFORMATION</Typography>
          </Card>
          <Card sx={{ height: 400, overflow: 'auto' }}>
            <Typography sx={{ p: 1, fontWeight: 'bold' }}>
              Review Target Due Date:
              <Typography variant="subtitle2">24th july 2022 (hard coded)</Typography>
            </Typography>
            <Typography sx={{ p: 1, fontWeight: 'bold' }}>
              Course Description:
              <Typography variant="subtitle2">{evaluation.description}</Typography>
            </Typography>
            <Typography sx={{ p: 1, fontWeight: 'bold' }}>
              Coordinators:
              <Typography variant="subtitle2">
                {evaluation.coordinators.map(({ username }) => username).join(', ')}
              </Typography>
            </Typography>
            <Typography sx={{ p: 1, fontWeight: 'bold' }}>
              Date Started:
              <Typography variant="subtitle2">10th july 2022 (hard coded) </Typography>
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ maxWidth: 300, backgroundColor: CustomTheme.palette.info.main, color: 'white', p: 1 }}>
            <Typography variant="subtitle2">DOCUMENTS</Typography>
          </Card>
          <Card sx={{ minHeight: 400, overflow: 'auto' }}></Card>
        </Grid>
      </Grid>
      <Box sx={{ p: 2 }}>
        <Card sx={{ maxWidth: 300, backgroundColor: CustomTheme.palette.info.main, color: 'white', p: 1 }}>
          <Typography variant="subtitle2">QUICK ACTIONS</Typography>
        </Card>
        <Card>
          <CardContent>
            <Stack spacing={5} direction="row">
              <Button variant="contained" color="primary">
                MARK AS COMPLETED
              </Button>
              <Button variant="contained" color="primary">
                EDIT EVALUATION
              </Button>
              <Button variant="contained" color="primary">
                MANAGE REVIEWERS
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}

export default Overview;
