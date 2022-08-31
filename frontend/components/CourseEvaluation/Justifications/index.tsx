/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { CourseEvaluationDetailEntry, EocGeneralEocSpecific, EocSetEocGeneral } from 'utils/api';
import useModal from '@/components/hooks/useModal';
import EOCAccordion from './EOCAccordion';
import EOCModal from './EOCModal';

type Props = {
  evaluation: CourseEvaluationDetailEntry;
};

const Justification = (props: Props) => {
  const { evaluation } = props;

  const eocModalState = useModal();

  const [currentlySelectedEOCGeneral, setCurrentlySelectedEOCGeneral] = useState<
    EocSetEocGeneral | undefined
  >(undefined);
  const [currentlySelectedEOCSpecific, setCurrentlySelectedEOCSpecific] = useState<
    EocGeneralEocSpecific | undefined
  >(undefined);

  const handleClose = () => {
    setCurrentlySelectedEOCSpecific(undefined);
    eocModalState.handleClose();
  };

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
          eocGeneral={
            currentlySelectedEOCGeneral || {
              id: 0,
              number: 0,
              title: '',
              eoc_specifics: [],
            }
          }
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
          handleSelectEOCSpecificAndGeneral={handleSelectEOCSpecificAndGeneral}
        />
      ))}
    </div>
  );
};

export default Justification;
