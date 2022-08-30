import React from 'react';
import { ReviewListEntry } from 'utils/api';
import { API_ENDPOINT, CourseEvaluationDetailEntry, ReviewListEntry } from 'utils/api';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Container from '@mui/material/Container';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import useModal from '@/components/hooks/useModal';
import AddReviewerModal from './AddReviewerModal';
import { userDisplayName } from '@/components/utils/generic';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import AreYouSureModalButton from '@/components/utils/AreYouSureModalButton';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import { useSWRConfig } from 'swr';
type Props = {
  review: ReviewListEntry;
};

const ReviewCard = (props: Props) => {
  const { review } = props;

  const axios = useAuthenticatedAPIClient();
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    try {
      await axios.delete(API_ENDPOINT.REVIEWS.DETAIL(review.id));
      mutate(API_ENDPOINT.COURSE_EVALUATION.DETAIL(review.course_evaluation.id));
    } catch (error) {
      // TODO
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  return (
    <Card key={review.id}>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item md={7}>
            <Typography gutterBottom variant="h5" component="div">
              {userDisplayName(review.reviewer)}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {/* TODO: #19 (part 1) */}
              <Button startIcon={<VisibilityIcon />} variant="outlined" color="primary" disabled>
                View
              </Button>
              <AreYouSureModalButton
                description="Are you sure you want to do this? THIS WILL DELETE ALL THE CONTENT OF THE REVIEW FOR THE REVIEWER."
                action={handleDelete}
                buttonProps={{
                  variant: 'outlined',
                  color: 'error',
                  startIcon: <DeleteIcon />,
                }}
              >
                Delete
              </AreYouSureModalButton>
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
            <ReviewProgress review={review} isCoordinator />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ReviewCard;
