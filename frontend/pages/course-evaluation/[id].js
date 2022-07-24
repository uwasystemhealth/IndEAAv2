import { useRouter } from 'next/router';

import SectionTabs from '@/components/CourseEvaluation/SectionTabs';

const Post = () => {
  const router = useRouter();
  const { id } = router.query;

  return <SectionTabs id={id}/>;
};

export default Post;
