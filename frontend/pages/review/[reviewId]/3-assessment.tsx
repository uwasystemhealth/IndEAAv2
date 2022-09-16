import React from 'react';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewerBottomNavigation from '@/components/Reviewer/ReviewerBottomNavigation';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import EOCAccordionWithModal from '@/components/Reviewer/Assessment/EOCAccordionWithModal';
import usePageTitle from '@/components/hooks/usePageTitle';
import EvaluationHeader from '@/components/Custom/EvaluationHeader';

const Assessment = () => {
  const { courseReview } = useCourseReview();
  const { courseEvaluation } = useCourseEvaluation(courseReview.course_evaluation.id);

  const STEP_INDEX = 2;
  const stepDetails = getReviewStepsWithState(courseReview)[STEP_INDEX];

  usePageTitle(`${courseEvaluation.unit_code} Review`);

  return (
    <BodyCard>
      <EvaluationHeader title={courseEvaluation.unit_code} />
      <ReviewProgress review={courseReview} />
      <AboutStepCard stepIndex={STEP_INDEX} />
      <EOCAccordionWithModal courseEvaluation={courseEvaluation} courseReview={courseReview} />
      <ReviewerBottomNavigation
        previousLink={stepDetails.prevStep}
        nextLink={stepDetails.nextStep}
      />
    </BodyCard>
  );
};

export default Assessment;
