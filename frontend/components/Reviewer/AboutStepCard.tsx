import React from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { getReviewStepsWithState } from '@/components/utils/reviews';

type Props = {
  stepIndex: number;
};

const AboutStepCard = (props: Props) => {
  const { stepIndex } = props;
  const stepDetails = getReviewStepsWithState()[stepIndex];
  return (
    <Card sx={{ m: 2 }}>
      <CardHeader
        title={`Step ${stepDetails.stepNo}: ${stepDetails.stepName}`}
        subheader={stepDetails.description}
      />
    </Card>
  );
};

export default AboutStepCard;
