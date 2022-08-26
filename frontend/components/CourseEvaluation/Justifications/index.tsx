/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import { CourseEvaluationDetailEntry } from 'utils/api';
import EOCAccordion from './EOCAccordion';

type Props = {
  evaluation: CourseEvaluationDetailEntry;
};

const Justification = (props: Props) => {
  const { evaluation } = props;
  return (
    <div>
      {evaluation.eoc_set.eoc_generals.map((eocGeneral) => (
        <EOCAccordion eocGeneral={eocGeneral} key={eocGeneral.id}/>
      ))}
    </div>
  );
};

export default Justification;
