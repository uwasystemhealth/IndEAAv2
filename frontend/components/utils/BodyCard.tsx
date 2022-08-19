import * as React from 'react';

import { Card, Container } from '@mui/material';

type BodyCardProps = {
  children: React.ReactNode;
  header: String;
};

const BodyCard = ({ children, header }: BodyCardProps): JSX.Element => {
  const headerComponent = header ? (
    <Card
      className="rounded-lg"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '30px',
        height: '4vw',
        width: '35vw',
        position: 'relative',
        top: '2vw',
        left: '2vw',
        background: '#0E91AC',
        color: 'white',
        fontSize: '30px',
        textAlign: 'left',
        fontFamily: 'Inter',
      }}
    >
      {header}
    </Card>
  ) : null;
  return (
    <Container maxWidth="xl">
      {headerComponent}
      <Card className="rounded-lg" style={{ background: '#f6f6f6', height: '20vw' }}>
        <Container>
          <div style={{ paddingTop: '5vh' }}>{children}</div>
        </Container>
      </Card>
    </Container>
  );
};

export default BodyCard;
