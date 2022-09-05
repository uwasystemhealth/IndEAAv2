import React, { useEffect } from 'react';

import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';

const Documents = () => {
  const { courseReview } = useCourseReview();
    
  // set document title to unit code
  useEffect(() => {
    document.title = courseReview.course_evaluation.unit_code;
  }, []);

  return (
    <BodyCard>
      <ReviewProgress review={courseReview} />
      <AboutStepCard stepIndex={1} />
    </BodyCard>
  );
};

export default Documents;
