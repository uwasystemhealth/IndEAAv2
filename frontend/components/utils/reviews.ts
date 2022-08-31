/* eslint-disable import/prefer-default-export */
import { ReviewListEntry } from 'utils/api';

export const getReviewStepsWithState = (review: ReviewListEntry) => {
  const initialConfig = [
    {
      stepName: 'Overview & Elements of Competency',
      stepLink: 'overview-and-eoc',
      done: Boolean(review.eoc_date_viewed),
    },
    {
      stepName: 'Read Documents',
      stepLink: 'documents',
      done: review.documents.length > 0,
    },

    {
      stepName: 'Review Course',
      stepLink: 'assessment',
      done: review.eoc_specific_reviews.length > 0,
    },
    {
      stepName: 'Review & Submit',
      stepLink: 'submit',
      done: Boolean(review.date_submitted),
    },
  ];

  return initialConfig.map((step, index) => ({
    ...step,
    fullLink: `/review/${review.id}/${index + 1}-${step.stepLink}`,
  }));
};
