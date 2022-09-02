import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import React, { ReactNode, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_ENDPOINT } from 'utils/api';
import TextField from '@mui/material/TextField';
import { useSWRConfig } from 'swr';
import Alert from '@mui/material/Alert';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import EOCAccordionWithModal from '@/components/Reviewer/Assessment/EOCAccordionWithModal';
import SimplifiedDocumentCard from '@/components/Reviewer/Submit/SimplifiedDocumentCard';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import BodyCard from '@/components/utils/BodyCard';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import ReviewerBottomNavigation from '@/components/Reviewer/ReviewerBottomNavigation';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import useCourseReview from '@/components/hooks/useCourseReview';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';

const StepWrapper = (props: { children: ReactNode; cardTitle: string }) => {
  const { children, cardTitle } = props;
  return (
    <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
      <Card>
        <CardHeader title={cardTitle} />
        <CardContent>{children}</CardContent>
      </Card>
    </Container>
  );
};

const Submit = () => {
  const { courseReview } = useCourseReview();
  const { courseEvaluation } = useCourseEvaluation(courseReview.course_evaluation.id);

  const STEP_INDEX = 3;
  const allSteps = getReviewStepsWithState(courseReview);
  const stepDetails = allSteps[STEP_INDEX];

  const axios = useAuthenticatedAPIClient();
  const { mutate } = useSWRConfig();
  const [error, setError] = useState('');

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
  }, [formik.errors]);

  return (
    <BodyCard>
      <ReviewProgress review={courseReview} />
      <AboutStepCard stepIndex={STEP_INDEX} />
      <StepWrapper cardTitle={`Step 1 - ${allSteps[0].stepName}`}>
        {courseReview.eoc_date_viewed ? (
          <Typography color="secondary.main">
            You have read and confirmed that you have understood the elements of competencies.
          </Typography>
        ) : (
          <Typography color="error.main">
            You have not yet read and confirmed that you have understood the elements of
            competencies.
          </Typography>
        )}
      </StepWrapper>
      <StepWrapper cardTitle={`Step 2 - ${allSteps[1].stepName}`}>
        <Grid container spacing={2}>
          {courseEvaluation.documents.map((document) => (
            <Grid item sm={12} md={4} key={document.id}>
              <SimplifiedDocumentCard document={document} review={courseReview} />
            </Grid>
          ))}
        </Grid>
      </StepWrapper>
      <StepWrapper cardTitle={`Step 3 - ${allSteps[2].stepName}`}>
        <EOCAccordionWithModal courseEvaluation={courseEvaluation} courseReview={courseReview} />
      </StepWrapper>
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
