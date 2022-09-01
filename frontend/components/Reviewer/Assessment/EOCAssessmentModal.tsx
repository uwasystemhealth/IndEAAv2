import React, { useState } from 'react';
import {
  API_ENDPOINT,
  CourseEvaluationDetailEntry,
  EocGeneralEocSpecific,
  EocSetEocGeneral,
  ReviewListEntry,
} from 'utils/api';
import Grid from '@mui/material/Grid';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSWRConfig } from 'swr';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import MenuItem from '@mui/material/MenuItem';
import { Typography } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import { DEVELOPMENT_LEVEL } from '@/components/utils/eoc';
import EOCDocumentsViewer from '@/components/CourseEvaluation/Justifications/EOCDocumentsViewer';

type Props = {
  eocGeneral: EocSetEocGeneral;
  eocSpecific: EocGeneralEocSpecific;
  courseEvaluation: CourseEvaluationDetailEntry;
  handleClose: () => void;

  review: ReviewListEntry;
};

const EOCAsessmentModal = (props: Props) => {
  const { eocGeneral, eocSpecific, courseEvaluation, handleClose, review } = props;
  // Business rule: There can only be one justification per EOC
  const coordinatorJustification = eocSpecific?.justification[0];
  const reviewerAssessment = review.eoc_specific_reviews.find(
    (eocSpecificReview) => eocSpecificReview.eoc_specific === eocSpecific.id,
  );

  // This modal can be used to create a new justification or edit an existing one.
  // This will determine what type of request we have to do to the API.
  const isEditMode = reviewerAssessment;

  const axios = useAuthenticatedAPIClient();
  const { mutate } = useSWRConfig();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      /* Note: The values here should match the field name in the models
        Otherwise, make it match in `onSubmit`
      */
      justification: reviewerAssessment?.justification || '',
      development_level: reviewerAssessment?.development_level || null,
      suggestion: reviewerAssessment?.suggestion || '',
    },
    validationSchema: Yup.object({
      justification: Yup.string().required('Justification is required'),
      development_level: Yup.number().required('Development level is required'),
      suggestion: Yup.string().required('Suggestion is required'),
    }),
    onSubmit: async (values) => {
      try {
        if (isEditMode) {
          await axios.patch(
            API_ENDPOINT.REVIEWS.EOC.DETAIL(review.id, reviewerAssessment.id),
            values,
          );
        } else if (review?.id) {
          await axios.post(API_ENDPOINT.REVIEWS.EOC.LIST(review.id), {
            ...values,
            eoc_specific: eocSpecific.id,
          });
        } else {
          // This should not be used if there is no reviewId
          throw new Error('Invalid state');
        }
        const urlToMutate = API_ENDPOINT.REVIEWS.DETAIL(review?.id || '');
        mutate(urlToMutate);
        handleClose();
        // eslint-disable-next-line @typescript-eslint/no-shadow
      } catch (error) {
        // @ts-ignore
        setError(error?.message || 'Something went wrong');
      }
    },
  });
  return (
    <Dialog fullWidth maxWidth="xl" open>
      <DialogTitle>
        EOC {eocSpecific.general_and_specific_eoc} - {eocSpecific.description}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {error && (
          <Alert variant="filled" severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid
            item
            sm={12}
            md={6}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Card>
              <CardHeader
                title="Background Information"
                subheader="This is where you can see information about the EOC and the coordinator's justification"
              />
              <CardContent>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', pb: 1, pr: 1 }}
                  color="success"
                >
                  Justification of Coordinators
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {coordinatorJustification.justification}
                </Typography>
                <Divider sx={{ m: 2 }} />
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', pb: 1, pr: 1 }}
                  color="success"
                >
                  Indicators of Attainment
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {eocSpecific.indicators_of_attainment.map((indicator, indicatorIndex) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <ListItem key={indicatorIndex} sx={{ display: 'list-item' }}>
                      {indicator}
                    </ListItem>
                  ))}
                </Typography>
              </CardContent>
            </Card>
            <Card>
              <CardHeader
                title="Assess the EOC"
                subheader="This is where you assess the EOC with your justification."
              />
              <CardContent>
                <TextField
                  margin="dense"
                  id="development_level"
                  name="development_level"
                  label="Development Level"
                  fullWidth
                  variant="outlined"
                  value={formik.values.development_level}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.development_level)}
                  helperText={formik.errors.development_level}
                  select
                >
                  {DEVELOPMENT_LEVEL.map((obj) => (
                    <MenuItem
                      key={obj.value}
                      value={obj.value}
                      sx={{
                        display: 'block',
                      }}
                    >
                      <Typography variant="body1">
                        Level {obj.value} - {obj.short}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 5 }}>
                        {obj.meaning}
                      </Typography>
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  margin="dense"
                  id="justification"
                  label="Justify the Development Level"
                  fullWidth
                  variant="outlined"
                  value={formik.values.justification}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.justification)}
                  helperText={formik.errors.justification}
                  multiline
                />
                <TextField
                  margin="dense"
                  id="suggestion"
                  label="Suggestion for Improvement"
                  fullWidth
                  variant="outlined"
                  value={formik.values.suggestion}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.suggestion)}
                  helperText={formik.errors.suggestion}
                  multiline
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={12} md={6}>
            <Card>
              <CardHeader
                title="Supporting Documents"
                subheader="This is where you can see the documents that are aligned to this EOC. Use this to assess rate the EOC."
              />
              <CardContent>
                <EOCDocumentsViewer
                  documents={courseEvaluation.documents}
                  eocGeneralToFilter={eocGeneral}
                  eocSpecificToFilter={eocSpecific}
                  isReadOnly
                  review={review}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => formik.handleSubmit()}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EOCAsessmentModal;
