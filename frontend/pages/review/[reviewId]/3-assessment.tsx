import Container from '@mui/material/Container';
import {
  DEFAULT_EOC_GENERAL_EOC_SPECIFIC,
  DEFAULT_EOC_SET_EOC_GENERAL,
  EocGeneralEocSpecific,
  EocSetEocGeneral,
} from 'utils/api';
import { useState } from 'react';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewerBottomNavigation from '@/components/Reviewer/ReviewerBottomNavigation';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import EOCAccordion from '@/components/CourseEvaluation/Justifications/EOCAccordion';
import EOCAsessmentModal from '@/components/Reviewer/Assessment/EOCAssessmentModal';
import useModal from '@/components/hooks/useModal';

const Assessment = () => {
  const { courseReview } = useCourseReview();
  const { courseEvaluation } = useCourseEvaluation(courseReview.course_evaluation.id);

  const STEP_INDEX = 2;
  const stepDetails = getReviewStepsWithState(courseReview)[STEP_INDEX];

  /**
   * State handlers for selected EOC
   */
  const eocModalState = useModal();

  const [currentlySelectedEOCGeneral, setCurrentlySelectedEOCGeneral] = useState<
    EocSetEocGeneral | undefined
  >(undefined);
  const [currentlySelectedEOCSpecific, setCurrentlySelectedEOCSpecific] = useState<
    EocGeneralEocSpecific | undefined
  >(undefined);

  const handleSelectEOCSpecificAndGeneral =
    (eocGeneral: EocSetEocGeneral) => (eocSpecific: EocGeneralEocSpecific) => {
      setCurrentlySelectedEOCGeneral(eocGeneral);
      setCurrentlySelectedEOCSpecific(eocSpecific);
      eocModalState.handleOpen();
    };
  return (
    <BodyCard>
      {eocModalState.isOpen && (
        <EOCAsessmentModal
          courseEvaluation={courseEvaluation}
          eocGeneral={currentlySelectedEOCGeneral || DEFAULT_EOC_SET_EOC_GENERAL}
          eocSpecific={currentlySelectedEOCSpecific || DEFAULT_EOC_GENERAL_EOC_SPECIFIC}
          handleClose={eocModalState.handleClose}
          review={courseReview}
        />
      )}
      <ReviewProgress review={courseReview} />
      <AboutStepCard stepIndex={STEP_INDEX} />
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
        {courseEvaluation.eoc_set.eoc_generals.map((eocGeneral) => (
          <EOCAccordion
            eocGeneral={eocGeneral}
            key={eocGeneral.id}
            handleSelectEOCSpecificAndGeneral={handleSelectEOCSpecificAndGeneral}
            review={courseReview}
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
