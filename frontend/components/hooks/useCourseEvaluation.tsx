import { useRouter } from 'next/router';
import {
  API_ENDPOINT,
  CourseEvaluationDetailEntry,
  DEFAULT_COURSE_EVALUTION_DETAIL_ENTRY,
} from 'utils/api';
import useSWRAuth from './useSWRAuth';

/**
 * Helper hook that pulls out the course evaluation id from the url and returns the SWR value for it
 */
const useCourseEvaluation = (overwriteCourseEvalutionId?: string) => {
  const router = useRouter();
  const courseEvaluationId = (overwriteCourseEvalutionId || router.query?.id || '') as string;

  const swrResult = useSWRAuth(
    courseEvaluationId ? API_ENDPOINT.COURSE_EVALUATION.DETAIL(courseEvaluationId) : '',
  );

  const courseEvaluation = ((swrResult.response?.data as unknown) ||
    DEFAULT_COURSE_EVALUTION_DETAIL_ENTRY) as CourseEvaluationDetailEntry;
  return { courseEvaluation, swr: swrResult };
};

export default useCourseEvaluation;
