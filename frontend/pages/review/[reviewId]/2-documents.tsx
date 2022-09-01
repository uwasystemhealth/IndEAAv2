import Grid from '@mui/material/Grid';
import { CourseEvaluationDetailEntry } from 'utils/api';
import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewerBottomNavigation from '@/components/Reviewer/ReviewerBottomNavigation';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import useModal from '@/components/hooks/useModal';
import DocumentCard from '@/components/CourseEvaluation/Documents/DocumentCard';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import Container from '@mui/material/Container';

const Documents = () => {
  const { courseReview } = useCourseReview();
  const { courseEvaluation } = useCourseEvaluation(courseReview.course_evaluation.id);

  const STEP_INDEX = 1;
  const stepDetails = getReviewStepsWithState(courseReview)[STEP_INDEX];

  return (
    <BodyCard>
      <ReviewProgress review={courseReview} />
      <AboutStepCard stepIndex={STEP_INDEX} />
      <Container maxWidth="xl">
        <Grid container spacing={2}>
          {courseEvaluation.documents.map((document) => {
            const reviewDocument = courseReview.documents.find(
              (currentDocumentInIteration) => currentDocumentInIteration.document === document.id,
            );
            return (
              <Grid item sm={12} md={4} key={document.id}>
                <DocumentCard
                  document={document}
                  isReadOnly
                  reviewId={courseReview.id}
                  reviewDocument={reviewDocument}
                />
              </Grid>
            );
          })}
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
