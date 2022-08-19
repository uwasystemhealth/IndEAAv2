import { useRouter } from 'next/router';

import SectionTabs from '@/components/CourseEvaluation/SectionTabs';

const Post = () => {
  const router = useRouter();
  const id = (router.query?.id || '') as string;

  return <SectionTabs courseEvaluationId={id} />;
};

export default Post;
