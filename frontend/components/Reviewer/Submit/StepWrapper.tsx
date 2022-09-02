import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import React, { ReactNode } from 'react';

const StepWrapper = (props: { children: ReactNode; cardTitle: string }) => {
  const { children, cardTitle } = props;
  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
      <Card>
        <CardHeader title={cardTitle} />
        <CardContent>{children}</CardContent>
      </Card>
    </Container>
  );
};

export default StepWrapper;
