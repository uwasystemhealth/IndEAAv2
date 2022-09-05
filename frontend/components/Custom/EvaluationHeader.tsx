import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';

interface EvaluationHeaderProps {
  title: string;
}

const EvaluationHeader = ({ title }: EvaluationHeaderProps) => (
  <Container sx={{ textAlign: 'center' }}>
    <CardHeader title={title} />
  </Container>
);

export default EvaluationHeader;
