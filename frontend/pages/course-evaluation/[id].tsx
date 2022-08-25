import { useRouter } from 'next/router';

import SectionTabs from '@/components/CourseEvaluation/SectionTabs';
import BodyCard from '@/components/utils/BodyCard';

const Post = () => {
  const router = useRouter();
  const id = (router.query?.id || '') as string;

  return (
    <BodyCard>
      <SectionTabs courseEvaluationId={id} />
    </BodyCard>
  );
};

export default Post;
