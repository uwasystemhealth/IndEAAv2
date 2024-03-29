import React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewerBottomNavigation from '@/components/Reviewer/ReviewerBottomNavigation';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import DocumentCard from '@/components/CourseEvaluation/Documents/DocumentCard';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import usePageTitle from '@/components/hooks/usePageTitle';
import EvaluationHeader from '@/components/Custom/EvaluationHeader';

const Documents = () => {
  const { courseReview } = useCourseReview();
  const { courseEvaluation } = useCourseEvaluation(courseReview.course_evaluation.id);

  usePageTitle(`${courseEvaluation.unit_code} Review`);

  const STEP_INDEX = 1;
  const stepDetails = getReviewStepsWithState(courseReview)[STEP_INDEX];

  return (
    <BodyCard>
      <EvaluationHeader title={courseEvaluation.unit_code} />
      <ReviewProgress review={courseReview} />
      <AboutStepCard stepIndex={STEP_INDEX} />
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
        <Grid container spacing={2}>
          {courseEvaluation.documents.map((document) => (
            <Grid item sm={12} md={4} key={document.id}>
              <DocumentCard
                document={document}
                isReadOnly={false}
                isReviewer
                review={courseReview}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
      <ReviewerBottomNavigation
        previousLink={stepDetails.prevStep}
        nextLink={stepDetails.nextStep}
      />
    </BodyCard>
  );
};

export default Documents;
