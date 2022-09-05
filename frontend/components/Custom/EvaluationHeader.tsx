
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';

interface EvaluationHeaderProps {
    title: string;
}

const EvaluationHeader = (props: EvaluationHeaderProps) => {
    return (<Container sx={{ textAlign: 'center' }}>
                <CardHeader title={props.title} />
            </Container>);
}

export default EvaluationHeader;