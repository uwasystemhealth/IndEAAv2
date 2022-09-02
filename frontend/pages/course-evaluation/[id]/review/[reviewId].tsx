import React from 'react';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import BodyCard from '@/components/utils/BodyCard';
import useCourseReview from '@/components/hooks/useCourseReview';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import ReviewSummarySubmissionContent from '@/components/Reviewer/Submit/ReviewSummarySubmissionContent';
import { userDisplayName } from '@/components/utils/generic';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import { useRouter } from 'next/router';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

const Summary = () => {
  const { courseReview } = useCourseReview(false);
  const { courseEvaluation } = useCourseEvaluation();
  const router = useRouter();

  const allSteps = getReviewStepsWithState(courseReview);

  return (
    <BodyCard>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
        <Button
          startIcon={<NavigateBeforeIcon />}
          onClick={() => {
            router.push(`/course-evaluation/${courseEvaluation.id}`);
          }}
        >
          Back to Course Evaluation
        </Button>
        <Card>
          <CardHeader title={`Review by: ${userDisplayName(courseReview.reviewer)}`} />
          <CardContent> Below is the summary of what the reviewer has put in.</CardContent>
          <CardActions />
        </Card>
      </Container>
      <ReviewSummarySubmissionContent
        allSteps={allSteps}
        courseReview={courseReview}
        courseEvaluation={courseEvaluation}
        isReadOnly
      />
    </BodyCard>
  );
};

export default Summary;
