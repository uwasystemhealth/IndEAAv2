/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { CourseEvaluationDetailEntry, EocGeneralEocSpecific } from 'utils/api';
import useModal from '@/components/hooks/useModal';
import EOCAccordion from './EOCAccordion';
import EOCModal from './EOCModal';

type Props = {
  evaluation: CourseEvaluationDetailEntry;
};

const Justification = (props: Props) => {
  const { evaluation } = props;

  const eocModalState = useModal();

  const [currentlySelectedEOCSpecific, setCurrentlySelectedEOCSpecific] = useState<
    EocGeneralEocSpecific | undefined
  >(undefined);

  const handleClose = () => {
    setCurrentlySelectedEOCSpecific(undefined);
    eocModalState.handleClose();
  };

  const handleSelectEOCSpecific = (eocSpecific: EocGeneralEocSpecific) => {
    setCurrentlySelectedEOCSpecific(eocSpecific);
    eocModalState.handleOpen();
  };
  return (
    <div>
      {eocModalState.isOpen && (
        <EOCModal
          eocSpecific={
            currentlySelectedEOCSpecific || {
              description: '',
              eoc_general: 0,
              general_and_specific_eoc: '',
              number: 0,
              id: 0,
              justification: [],
              indicators_of_attainment: [],
            }
          }
          handleClose={handleClose}
        />
      )}
      {evaluation.eoc_set.eoc_generals.map((eocGeneral) => (
        <EOCAccordion
          eocGeneral={eocGeneral}
          key={eocGeneral.id}
          handleSelectEOCSpecific={handleSelectEOCSpecific}
        />
      ))}
    </div>
  );
};

export default Justification;
