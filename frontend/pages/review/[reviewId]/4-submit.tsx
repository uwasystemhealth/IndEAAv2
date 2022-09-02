import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewerBottomNavigation from '@/components/Reviewer/ReviewerBottomNavigation';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DocumentCard from '@/components/CourseEvaluation/Documents/DocumentCard';
import SimplifiedDocumentCard from '@/components/Reviewer/Submit/SimplifiedDocumentCard';

const Submit = () => {
  const { courseReview } = useCourseReview();
  const { courseEvaluation } = useCourseEvaluation(courseReview.course_evaluation.id);

  const STEP_INDEX = 3;
  const allSteps = getReviewStepsWithState(courseReview);
  const stepDetails = allSteps[STEP_INDEX];
  const handleSubmit = () => {};

  return (
    <BodyCard>
      <ReviewProgress review={courseReview} />
      <AboutStepCard stepIndex={STEP_INDEX} />
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
        <Card>
          <CardHeader title={`Step 1 - ${allSteps[0].stepName}`} />
          <CardContent>
            <Container maxWidth="xl">
              {courseReview.eoc_date_viewed ? (
                <Typography color="secondary.main">
                  You have read and confirmed that you have understood the elements of competencies.
                </Typography>
              ) : (
                <Typography color="error.main">
                  You have not yet read and confirmed that you have understood the elements of
                  competencies.
                </Typography>
              )}
            </Container>
          </CardContent>
        </Card>
      </Container>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
        <Card>
          <CardHeader title={`Step 2 - ${allSteps[1].stepName}`} />
          <CardContent>
            <Container maxWidth="xl">
              <Grid container spacing={2}>
                {courseEvaluation.documents.map((document) => (
                  <Grid item sm={12} md={4} key={document.id}>
                    <SimplifiedDocumentCard document={document} review={courseReview} />
                  </Grid>
                ))}
              </Grid>
            </Container>
          </CardContent>
        </Card>
      </Container>
      <ReviewerBottomNavigation
        previousLink={stepDetails.prevStep}
        nextLink={stepDetails.nextStep}
        handleSubmit={handleSubmit}
      />
    </BodyCard>
  );
};

export default Submit;
