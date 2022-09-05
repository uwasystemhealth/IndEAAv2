import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_ENDPOINT } from 'utils/api';
import TextField from '@mui/material/TextField';
import { useSWRConfig } from 'swr';
import Alert from '@mui/material/Alert';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import BodyCard from '@/components/utils/BodyCard';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import ReviewerBottomNavigation from '@/components/Reviewer/ReviewerBottomNavigation';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import useCourseReview from '@/components/hooks/useCourseReview';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import StepWrapper from '@/components/Reviewer/Submit/StepWrapper';
import ReviewSummarySubmissionContent from '@/components/Reviewer/Submit/ReviewSummarySubmissionContent';
import usePageTitle from '@/components/hooks/usePageTitle';
import Container from '@mui/material/Container';
import CardHeader from '@mui/material/CardHeader';
import EvaluationHeader from '@/components/Custom/EvaluationHeader';

const Submit = () => {
  const { courseReview } = useCourseReview();

  usePageTitle(courseReview.course_evaluation.unit_code + " Review");

  const { courseEvaluation } = useCourseEvaluation(courseReview.course_evaluation.id);

  const STEP_INDEX = 3;
  const allSteps = getReviewStepsWithState(courseReview);
  const stepDetails = allSteps[STEP_INDEX];

  const [error, setError] = useState('');
  const axios = useAuthenticatedAPIClient();
  const { mutate } = useSWRConfig();

  // An object with key as the step number, value as whether it is done
  const formik = useFormik({
    initialValues: {
      /* Note: The values here should match the field name in the models
        Otherwise, make it match in `onSubmit`
      */
      step1: allSteps[0].done,
      step2: allSteps[1].done,
      step3: allSteps[2].done,
      final_comment: courseReview.final_comment || '',
    },
    validationSchema: Yup.object({
      // Step should be true
      step1: Yup.boolean().oneOf([true], 'Step 1 - Please confirm the step is done'),
      step2: Yup.boolean().oneOf([true], 'Step 2 - Please mark atleast one document as viewed.'),
      step3: Yup.boolean().oneOf([true], 'Step 3 - Please provide atleast one assessment.'),
      final_comment: Yup.string().required('Final comment is required'),
    }),
    onSubmit: async (values) => {
      try {
        const url = API_ENDPOINT.REVIEWS.DETAIL(courseReview.id);
        await axios.patch(url, {
          final_comment: values.final_comment,
          date_submitted: new Date(),
        });

        // Flush SWR cache to refresh screen
        mutate(url);

        // eslint-disable-next-line @typescript-eslint/no-shadow
      } catch (error) {
        // @ts-ignore
        setError(error?.message || 'Something went wrong');
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (formik.errors) {
      const allString = Object.values(formik.errors).join('. ');
      setError(allString);
    } else {
      setError('');
    }
  }, [formik.errors, setError]);

  return (
    <BodyCard>
      <EvaluationHeader title={courseEvaluation.unit_code}/>
      <Container sx={{ textAlign: 'center' }}>
        <CardHeader title={courseEvaluation.unit_code} />
      </Container>
      <ReviewProgress review={courseReview} />
      <AboutStepCard stepIndex={STEP_INDEX} />
      <ReviewSummarySubmissionContent
        allSteps={allSteps}
        courseReview={courseReview}
        courseEvaluation={courseEvaluation}
        isReadOnly={false}
      />
      <StepWrapper cardTitle={`Step 4 - ${allSteps[3].stepName}`}>
        <TextField
          margin="dense"
          id="final_comment"
          label="Final Comment"
          fullWidth
          variant="outlined"
          multiline
          value={formik.values.final_comment}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.final_comment)}
          helperText={formik.errors.final_comment}
        />
      </StepWrapper>
      {error && (
        <Alert variant="filled" severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      <ReviewerBottomNavigation
        previousLink={stepDetails.prevStep}
        nextLink={stepDetails.nextStep}
        handleSubmit={formik.handleSubmit}
        modalConfirmation={{
          title: 'Submit Review',
          description:
            'You are about to submit a review. Upon submission of a review, you will lose the ability to edit your review. If you have to edit a review, you will have to contact the coordinator of this unit.',
        }}
      />
    </BodyCard>
  );
};

export default Submit;
