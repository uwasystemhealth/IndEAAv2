import React from 'react';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import BodyCard from '@/components/utils/BodyCard';
import useCourseReview from '@/components/hooks/useCourseReview';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import ReviewSummarySubmissionContent from '@/components/Reviewer/Submit/ReviewSummarySubmissionContent';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import usePageTitle from '@/components/hooks/usePageTitle';
import EvaluationHeader from '@/components/Custom/EvaluationHeader';

const Finish = () => {
  const { courseReview } = useCourseReview(false);
  const { courseEvaluation } = useCourseEvaluation(courseReview.course_evaluation.id);

  usePageTitle(`${courseEvaluation.unit_code} Review`);

  const allSteps = getReviewStepsWithState(courseReview);

  return (
    <BodyCard>
      <EvaluationHeader title={courseEvaluation.unit_code} />
      <AboutStepCard
        title="5 - Finish"
        subheader="You have completed submission for this review. See below for your review. If there is something wrong here, please contact the coordinator of this course evaluation"
      />
      <ReviewSummarySubmissionContent
        allSteps={allSteps}
        courseReview={courseReview}
        courseEvaluation={courseEvaluation}
        isReadOnly
      />
    </BodyCard>
  );
};

export default Finish;
