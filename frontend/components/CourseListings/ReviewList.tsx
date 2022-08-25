import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { ReviewListEntry } from 'utils/api';
import ReviewProgress from '../Reviewer/ReviewProgress';

type Props = {
  list: ReviewListEntry[];
};

const ReviewList = ({ list }: Props) => (
  <Container>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        pb: 2,
      }}
    >
      <Stack spacing={2} direction="row">
        <Button variant="contained" color="primary">
          CREATE NEW EVALUATION
        </Button>
        <Button variant="contained" color="secondary">
          SHOW COMPLETED
        </Button>
      </Stack>
    </Box>
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
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography gutterBottom variant="h5" component="div">
                  {reviewEntry.course_evaluation.unit_code}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold', pb: 1, pr: 1 }}>Coordinators:</Typography>
                  <Typography>
                    {reviewEntry.course_evaluation.coordinators
                      .map(({ username }) => username)
                      .join(', ')}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {reviewEntry.course_evaluation.description}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <ReviewProgress review={reviewEntry} />
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  </Container>
);

export default ReviewList;
