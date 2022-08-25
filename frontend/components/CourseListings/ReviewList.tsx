import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { ReviewListEntry } from 'utils/api';
import Grid from '@mui/material/Grid';
import ReviewProgress from '../Reviewer/ReviewProgress';
import { listOfUserDisplayNames, userDisplayName } from '../utils/generic';

type Props = {
  list: ReviewListEntry[];
};

const ReviewList = ({ list }: Props) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}
  >
    {list.map((reviewEntry) => (
      <Card key={reviewEntry.id}>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item md={7}>
              <Typography gutterBottom variant="h5" component="div">
                {reviewEntry.course_evaluation.unit_code}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                }}
              >
                <Typography sx={{ fontWeight: 'bold', pb: 1, pr: 1 }}>Coordinators:</Typography>
                <Typography>
                  {listOfUserDisplayNames(reviewEntry.course_evaluation.coordinators)}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {reviewEntry.course_evaluation.description}
              </Typography>
            </Grid>
            <Grid
              item
              md={5}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <ReviewProgress review={reviewEntry} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    ))}
  </Box>
);

export default ReviewList;
