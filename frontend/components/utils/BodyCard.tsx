import * as React from 'react';

import { Card, Container } from '@mui/material'

type BodyCardProps = {
  children?: React.ReactNode;
}

const BodyCard = ({children}: BodyCardProps): JSX.Element => {
  return (
    <Container maxWidth="xl">
      <Card>
        {children}
      </Card>
    </Container>
  );
}

export default BodyCard;
