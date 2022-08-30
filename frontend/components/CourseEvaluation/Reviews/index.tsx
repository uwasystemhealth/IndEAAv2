/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { CourseEvaluationDetailEntry } from 'utils/api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import useModal from '@/components/hooks/useModal';
import AddReviewerModal from './AddReviewerModal';
import ReviewCard from './ReviewCard';

type Props = {
  evaluation: CourseEvaluationDetailEntry;
};

const Reviews = (props: Props) => {
  const { evaluation } = props;

  const addReviewerModalState = useModal();

  return (
    <>
      {addReviewerModalState.isOpen && (
        <AddReviewerModal evaluation={evaluation} handleClose={addReviewerModalState.handleClose} />
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
      <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
        {evaluation.reviews.map((review) => (
          <ReviewCard review={review} />
        ))}
      </Stack>
    </>
  );
};

export default Reviews;
