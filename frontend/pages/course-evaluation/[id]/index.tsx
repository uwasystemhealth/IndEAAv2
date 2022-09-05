import { useEffect } from 'react';
import SectionTabs from '@/components/CourseEvaluation/SectionTabs';
import BodyCard from '@/components/utils/BodyCard';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import usePageTitle from '@/components/hooks/usePageTitle';
import EvaluationHeader from '@/components/Custom/EvaluationHeader';

const Post = () => {
  
  const { courseEvaluation } = useCourseEvaluation();
 
  usePageTitle(courseEvaluation.unit_code + " Manage");

  return (
  <BodyCard>
    <EvaluationHeader title={courseEvaluation.unit_code}/>
    <SectionTabs />
  </BodyCard>
)};

export default Post;
