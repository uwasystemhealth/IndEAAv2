import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Button, Chip, Container, Stack } from '@mui/material';
import { CourseEvaluationListEntry } from 'utils/api';
import CustomTheme from '../utils/CustomTheme';
import { green, pink, purple } from '@mui/material/colors';

type Props = {
  evaluation: CourseEvaluationListEntry;
};

function Overview({ evaluation }: Props) {
  const dateString = evaluation.created_at?.slice(0, 10);

  return (
    <Container>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              maxWidth: 300,
              backgroundColor: CustomTheme.palette.info.main,
              color: 'white',
              p: 1,
            }}
          >
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
                {evaluation.coordinators?.map(({ username }) => username).join(', ')}
              </Typography>
            </Typography>
            <Typography sx={{ p: 1, fontWeight: 'bold' }}>
              Date Started:
              <Typography variant="subtitle2">{dateString}</Typography>
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card
            sx={{
              maxWidth: 300,
              backgroundColor: CustomTheme.palette.info.main,
              color: 'white',
              p: 1,
            }}
          >
            <Typography variant="subtitle2">DOCUMENTS</Typography>
          </Card>
          <Card sx={{ minHeight: 400, overflow: 'auto' }}>
            <CardContent>
              <Stack spacing={5} direction="column">
                <>
                  {evaluation.documents.map((document) => (
                    <Card>
                      <CardContent>
                        <Typography fontWeight="fontWeightBold" variant="h6">
                          {document.name}
                        </Typography>
                        <Typography variant="h6">{document.description}</Typography>
                        <Grid container spacing={1}>
                          {document.isInIntroduction ? (
                            <Grid item>
                              <Chip
                                label="INTRODUCTION"
                                sx={{ backgroundColor: pink[500], color: 'white' }}
                              ></Chip>
                            </Grid>
                          ) : (
                            <></>
                          )}

                          {document.eocGeneral.map((eocGeneral) => (
                            <Grid item>
                              <Chip
                                label={`EOC ${eocGeneral.number}`}
                                sx={{ backgroundColor: purple[200], color: 'white' }}
                              ></Chip>
                            </Grid>
                          ))}

                          {document.eocSpecific.map((eocSpecific) => (
                            <Grid item>
                              <Chip
                                label={`EOC ${eocSpecific.eoc_general}.${eocSpecific.number}`}
                                sx={{ backgroundColor: green[500], color: 'white' }}
                              ></Chip>
                            </Grid>
                          ))}
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ p: 2 }}>
        <Card
          sx={{
            maxWidth: 300,
            backgroundColor: CustomTheme.palette.info.main,
            color: 'white',
            p: 1,
          }}
        >
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
