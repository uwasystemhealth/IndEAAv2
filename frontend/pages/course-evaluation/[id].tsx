import { useEffect } from 'react';
import SectionTabs from '@/components/CourseEvaluation/SectionTabs';
import BodyCard from '@/components/utils/BodyCard';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';

const Post = () => {
  
  const { courseEvaluation } = useCourseEvaluation();
    
  // set document title to unit code
  useEffect(() => {
    document.title = courseEvaluation.unit_code + " Manage";
  }, [courseEvaluation.unit_code]);

  return (
  <BodyCard>
    <SectionTabs />
  </BodyCard>
)};

export default Post;
