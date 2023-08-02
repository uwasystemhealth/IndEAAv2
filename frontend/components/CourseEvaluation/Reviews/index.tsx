/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { API_ENDPOINT, CourseEvaluationDetailEntry } from 'utils/api';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import useModal from '@/components/hooks/useModal';
import AddReviewerModal from './AddReviewerModal';
import ReviewCard from './ReviewCard';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';

type Props = {
  evaluation: CourseEvaluationDetailEntry;
};

const Reviews = (props: Props) => {
  const { evaluation } = props;

  const addReviewerModalState = useModal();

  const axios = useAuthenticatedAPIClient();

  const downloadReport = async () => {
    const data = await axios.get(API_ENDPOINT.COURSE_EVALUATION.DOWNLOAD(evaluation.id), {
      responseType: 'blob',
    });

    // get filename from the content-disposition header
    const filename = data.headers['content-disposition']
      ? (data.headers['content-disposition'].match(/filename="(.+?)"/) || ['null', 'null'])[1]
      : 'null';

    // there doesn't seem to be a way to download files directly with axios, or
    // to extract the authentication tokens from axios then use it in a button
    // href
    const anchor = document.createElement('a');
    anchor.href = URL.createObjectURL(data.data);
    anchor.setAttribute('download', filename);
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

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
          <Button
            startIcon={<AssessmentIcon />}
            variant="contained"
            color="secondary"
            onClick={downloadReport}
          >
            Download Compiled Report
          </Button>
        </Box>
      </Container>
      <Stack direction="column" spacing={2} sx={{ mt: 2 }}>
        {evaluation.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </Stack>
    </>
  );
};

export default Reviews;
