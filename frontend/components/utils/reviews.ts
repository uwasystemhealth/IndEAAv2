/* eslint-disable import/prefer-default-export */
import { ReviewListEntry } from 'utils/api';

export const getReviewStepsWithState = (review?: ReviewListEntry) => {
  const initialConfig = [
    {
      stepName: 'Overview & Elements of Competency',
      stepLink: 'overview-and-eoc',
      done: Boolean(review?.eoc_date_viewed),
      description:
        'This section is an introduction of the course and the review process. Below you will see documents that introduces the unit, as well as the Elements of Competencies (EOCs) and their indicators of attainment.',
    },
    {
      stepName: 'Read Documents',
      stepLink: 'documents',
      done: review ? review?.documents.length > 0 : false,
      description:
        'This section contains all the documents related in this review. You will see also in the assessment section when reviewing specific EOCs. Please Review the following documents. These should form the basis of your assessment of how this course contributes to the attainment of the Element of Competency outlined in step 1',
    },

    {
      stepName: 'Review Course',
      stepLink: 'assessment',
      done: review ? review?.eoc_specific_reviews.length > 0 : false,
      description:
        'This section contains all the elements of competencies to be assessed. Please click the EOC below to rate and give comment.',
    },
    {
      stepName: 'Review & Submit',
      stepLink: 'submit',
      done: Boolean(review?.date_submitted),
      description:
        'This section contains the summary of all your responses per section. Please review before submitting.',
    },
  ];

  const configWithFullLink = initialConfig.map((step, index) => {
    const stepNo = index + 1;
    return {
      stepNo,
      ...step,
      fullLink: `/review/${review?.id}/${stepNo}-${step.stepLink}`,
    };
  });

  // Processing of navigation
  const configWithDeterminedData = configWithFullLink.map((step, index) => {
    const nextStep = configWithFullLink[index + 1];
    const prevStep = configWithFullLink[index - 1];
    return {
      ...step,
      nextStep: nextStep ? nextStep.fullLink : null,
      prevStep: prevStep ? prevStep.fullLink : null,
    };
  });

  return configWithDeterminedData;
};
