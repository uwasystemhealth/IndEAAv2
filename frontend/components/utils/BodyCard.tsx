import * as React from 'react';

import { Card, CardContent, Container } from '@mui/material';

type BodyCardProps = {
  children: React.ReactNode;
};

const BodyCard = ({ children }: BodyCardProps): JSX.Element => (
  <Container maxWidth="xl">
    <Card>
      <CardContent
        sx={{
          minHeight: '50vh',
          display: 'block',
        }}
      >
        {children}
      </CardContent>
    </Card>
  </Container>
);

export default BodyCard;
