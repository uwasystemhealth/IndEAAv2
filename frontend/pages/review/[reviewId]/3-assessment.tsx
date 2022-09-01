import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewerBottomNavigation from '@/components/Reviewer/ReviewerBottomNavigation';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import EOCAccordion from '@/components/CourseEvaluation/Justifications/EOCAccordion';
import Container from '@mui/material/Container';

const Assessment = () => {
  const { courseReview } = useCourseReview();
  const { courseEvaluation } = useCourseEvaluation(courseReview.course_evaluation.id);

  const STEP_INDEX = 2;
  const stepDetails = getReviewStepsWithState(courseReview)[STEP_INDEX];

  return (
    <BodyCard>
      <ReviewProgress review={courseReview} />
      <AboutStepCard stepIndex={STEP_INDEX} />
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
        {courseEvaluation.eoc_set.eoc_generals.map((eocGeneral) => (
          <EOCAccordion
            eocGeneral={eocGeneral}
            key={eocGeneral.id}
            handleSelectEOCSpecificAndGeneral={() => {}}
          />
        ))}
      </Container>
      <ReviewerBottomNavigation
        previousLink={stepDetails.prevStep}
        nextLink={stepDetails.nextStep}
      />
    </BodyCard>
  );
};

export default Assessment;
