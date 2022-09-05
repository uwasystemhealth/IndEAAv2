import React, { useEffect } from 'react';

import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewerBottomNavigation from '@/components/Reviewer/ReviewerBottomNavigation';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import EOCAccordionWithModal from '@/components/Reviewer/Assessment/EOCAccordionWithModal';

const Assessment = () => {
  const { courseReview } = useCourseReview();
  const { courseEvaluation } = useCourseEvaluation(courseReview.course_evaluation.id);

  const STEP_INDEX = 2;
  const stepDetails = getReviewStepsWithState(courseReview)[STEP_INDEX];
  
  // set document title to unit code
  useEffect(() => {
    document.title = courseReview.course_evaluation.unit_code + " Review";
  }, [courseReview.course_evaluation.unit_code]);

  return (
    <BodyCard>
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
