import Container from '@mui/material/Container';
import {
  CourseEvaluationDetailEntry,
  DEFAULT_EOC_GENERAL_EOC_SPECIFIC,
  DEFAULT_EOC_SET_EOC_GENERAL,
  EocGeneralEocSpecific,
  EocSetEocGeneral,
  ReviewListEntry,
} from 'utils/api';
import { useState } from 'react';
import EOCAccordion from '@/components/CourseEvaluation/Justifications/EOCAccordion';
import EOCAsessmentModal from '@/components/Reviewer/Assessment/EOCAssessmentModal';
import useModal from '@/components/hooks/useModal';

interface EOCAccordionWithModalType {
  courseEvaluation: CourseEvaluationDetailEntry;
  courseReview: ReviewListEntry;

  isReadOnly?: boolean;
}

const EOCAccordionWithModal = (props: EOCAccordionWithModalType) => {
  const { courseEvaluation, courseReview, isReadOnly } = props;

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
    <>
      {eocModalState.isOpen && (
        <EOCAsessmentModal
          courseEvaluation={courseEvaluation}
          eocGeneral={currentlySelectedEOCGeneral || DEFAULT_EOC_SET_EOC_GENERAL}
          eocSpecific={currentlySelectedEOCSpecific || DEFAULT_EOC_GENERAL_EOC_SPECIFIC}
          handleClose={eocModalState.handleClose}
          review={courseReview}
          isReadOnly={isReadOnly}
        />
      )}

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
    </>
  );
};

EOCAccordionWithModal.defaultProps = {
  isReadOnly: false,
};

export default EOCAccordionWithModal;
