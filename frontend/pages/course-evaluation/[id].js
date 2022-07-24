import { useRouter } from 'next/router';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import SectionTabs from '@/components/CourseEvaluation/SectionTabs'


const Post = () => {
  const router = useRouter();
  const { id } = router.query;

  console.log(id)
  
  return (
    <SectionTabs />
  );
};

export default Post;
