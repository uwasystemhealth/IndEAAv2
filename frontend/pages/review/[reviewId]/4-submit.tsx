import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';

const Submit = () => {
  const { courseReview } = useCourseReview();

  return (
    <BodyCard>
      <ReviewProgress review={courseReview} />
      <AboutStepCard stepIndex={3} />
    </BodyCard>
  );
};

export default Submit;
