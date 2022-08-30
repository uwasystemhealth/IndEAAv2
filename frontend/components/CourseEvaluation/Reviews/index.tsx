/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { CourseEvaluationDetailEntry, ReviewListEntry } from 'utils/api';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import { userDisplayName } from '@/components/utils/generic';
import Container from '@mui/material/Container';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import useModal from '@/components/hooks/useModal';
import AddReviewerModal from './AddReviewerModal';

type Props = {
  evaluation: CourseEvaluationDetailEntry;
};

const Reviews = (props: Props) => {
  const { evaluation } = props;

  const addReviewerModalState = useModal();
  return (
    <>
      {addReviewerModalState.isOpen && (
        <AddReviewerModal handleClose={addReviewerModalState.handleClose}></AddReviewerModal>
      )}
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'end' }}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={addReviewerModalState.handleOpen}
          >
            Add Reviewer
          </Button>
          <Button startIcon={<AssessmentIcon />} variant="contained" color="secondary" disabled>
            View Compiled Report
          </Button>
        </Box>
      </Container>
      <Container maxWidth="xl" sx={{ mt: 2 }}>
        {evaluation.reviews.map((review) => (
          <Card key={review.id}>
            <CardContent>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item md={7}>
                  <Typography gutterBottom variant="h5" component="div">
                    {userDisplayName(review.reviewer)}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button startIcon={<VisibilityIcon />} variant="outlined" color="primary">
                      View
                    </Button>
                    <Button startIcon={<DeleteIcon />} variant="outlined" color="error">
                      Delete
                    </Button>
                  </Box>
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
                  <ReviewProgress review={review} />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Container>
    </>
  );
};

export default Reviews;
