import { useRouter } from 'next/router';
import { API_ENDPOINT, DEFAULT_REVIEW_LIST_ENTRY, ReviewListEntry } from 'utils/api';
import useSWRAuth from './useSWRAuth';

/**
 * Helper hook that pulls out the review id from the url and returns the SWR value for it
 * @redirectIfDone - If true, will redirect to the review page if the review is done
 */
const useCourseReview = (redirectIfDone = true) => {
  const router = useRouter();
  const reviewId = (router.query?.reviewId || '') as string;

  const swrResult = useSWRAuth(reviewId ? API_ENDPOINT.REVIEWS.DETAIL(reviewId) : '');
  const courseReview = ((swrResult.response?.data as unknown) ||
    DEFAULT_REVIEW_LIST_ENTRY) as ReviewListEntry;

  if (courseReview.date_submitted && redirectIfDone) {
    router.push(`/review/${reviewId}/5-finish`);
  }

  return { courseReview, swr: swrResult };
};

export default useCourseReview;
