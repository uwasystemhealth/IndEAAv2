import React from 'react';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import BodyCard from '@/components/utils/BodyCard';
import useCourseReview from '@/components/hooks/useCourseReview';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import ReviewSummarySubmissionContent from '@/components/Reviewer/Submit/ReviewSummarySubmissionContent';

const Summary = () => {
  const { courseReview } = useCourseReview(false);
  const { courseEvaluation } = useCourseEvaluation();

  const allSteps = getReviewStepsWithState(courseReview);

  return (
    <BodyCard>
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
