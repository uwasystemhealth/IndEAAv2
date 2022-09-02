import React from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import { getReviewStepsWithState } from '@/components/utils/reviews';

type Props = {
  stepIndex: number;
};

const AboutStepCard = (props: Props) => {
  const { stepIndex } = props;
  const stepDetails = getReviewStepsWithState()[stepIndex];
  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
      <Card>
        <CardHeader
          title={`Step ${stepDetails.stepNo}: ${stepDetails.stepName}`}
          subheader={stepDetails.description}
        />
      </Card>
    </Container>
  );
};

export default AboutStepCard;
