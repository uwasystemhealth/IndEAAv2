/* eslint-disable import/prefer-default-export */
import { ReviewListEntry } from 'utils/api';

export const determineStepsStateOfReview = (review: ReviewListEntry) => ({
  step1: Boolean(review.eoc_date_viewed),
  step2: review.documents.length > 0,
  step3: review.eoc_specific_reviews.length > 0,
  step4: Boolean(review.date_submitted),
});
