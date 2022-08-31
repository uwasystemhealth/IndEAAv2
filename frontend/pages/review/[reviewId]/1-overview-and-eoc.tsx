import React from 'react';
import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';

const OverviewAndEOC = () => {
  const { courseReview } = useCourseReview();

  return (
    <BodyCard>
      <ReviewProgress review={courseReview} />
      <AboutStepCard stepIndex={0} />
    </BodyCard>
  );
};

export default OverviewAndEOC;
