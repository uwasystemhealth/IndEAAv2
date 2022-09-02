import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewerBottomNavigation from '@/components/Reviewer/ReviewerBottomNavigation';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import DocumentCard from '@/components/CourseEvaluation/Documents/DocumentCard';
import SimplifiedDocumentCard from '@/components/Reviewer/Submit/SimplifiedDocumentCard';
import React, { ReactNode, useEffect, useState } from 'react';
import EOCAccordionWithModal from '@/components/Reviewer/Assessment/EOCAccordionWithModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { API_ENDPOINT } from 'utils/api';
import TextField from '@mui/material/TextField';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import { useSWRConfig } from 'swr';

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
  const stepsDoneObject = allSteps.reduce((acc, curr) => {
    acc[`step${curr.stepNo}`] = curr.done;
    return acc;
  }, {} as { [key: string]: boolean });
  const formik = useFormik({
    initialValues: {
      /* Note: The values here should match the field name in the models
        Otherwise, make it match in `onSubmit`
      */
      ...stepsDoneObject,
      final_comment: '',
    },
    validationSchema: Yup.object({
      final_comment: Yup.string().required('Required'),
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
      <ReviewerBottomNavigation
        previousLink={stepDetails.prevStep}
        nextLink={stepDetails.nextStep}
        handleSubmit={formik.handleSubmit}
      />
    </BodyCard>
  );
};

export default Submit;
