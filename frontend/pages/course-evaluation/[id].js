import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';


const Post = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log(id)

  return (
    <Container>
      <Card>
        <Typography>hello</Typography>
      </Card>
    </Container>
  );
};

export default Post;
