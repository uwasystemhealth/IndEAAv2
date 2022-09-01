/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import {
  CourseEvaluationDetailEntry,
  DEFAULT_EOC_GENERAL_EOC_SPECIFIC,
  DEFAULT_EOC_SET_EOC_GENERAL,
  EocGeneralEocSpecific,
  EocSetEocGeneral,
} from 'utils/api';
import useModal from '@/components/hooks/useModal';
import EOCAccordion from './EOCAccordion';
import EOCModal from './EOCModal';

type Props = {
  evaluation: CourseEvaluationDetailEntry;
};

const Justification = (props: Props) => {
  const { evaluation } = props;

  
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
    <div>
      {eocModalState.isOpen && (
        <EOCModal
          courseEvaluation={evaluation}
          eocGeneral={currentlySelectedEOCGeneral || DEFAULT_EOC_SET_EOC_GENERAL}
          eocSpecific={currentlySelectedEOCSpecific || DEFAULT_EOC_GENERAL_EOC_SPECIFIC}
          handleClose={eocModalState.handleClose}
        />
      )}
      {evaluation.eoc_set.eoc_generals.map((eocGeneral) => (
        <EOCAccordion
          eocGeneral={eocGeneral}
          key={eocGeneral.id}
          handleSelectEOCSpecificAndGeneral={handleSelectEOCSpecificAndGeneral}
        />
      ))}
    </div>
  );
};

export default Justification;
