import React from 'react';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import { getReviewStepsWithState } from '@/components/utils/reviews';

type Props = {
  stepIndex?: number;

  // These are required if StepIndex is not given
  title?: string;
  subheader?: string;
};

const AboutStepCard = (props: Props) => {
  const { stepIndex, title, subheader } = props;
  const stepDetails = getReviewStepsWithState()[stepIndex || 0];

  const displayTitle = title || `Step ${stepDetails.stepNo}: ${stepDetails.stepName}` || '';
  const displaySubheader = subheader || stepDetails.description || '';
  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
      <Card>
        <CardHeader title={displayTitle} subheader={displaySubheader} />
      </Card>
    </Container>
  );
};

AboutStepCard.defaultProps = {
  stepIndex: 0,
  title: '',
  subheader: '',
};
export default AboutStepCard;
