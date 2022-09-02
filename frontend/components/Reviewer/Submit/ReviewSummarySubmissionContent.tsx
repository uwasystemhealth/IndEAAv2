import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import React from 'react';
import { CourseEvaluationDetailEntry, ReviewListEntry } from 'utils/api';
import TextField from '@mui/material/TextField';
import EOCAccordionWithModal from '@/components/Reviewer/Assessment/EOCAccordionWithModal';
import SimplifiedDocumentCard from '@/components/Reviewer/Submit/SimplifiedDocumentCard';
import { ReviewStepWithStateType } from '@/components/utils/reviews';
import StepWrapper from '@/components/Reviewer/Submit/StepWrapper';

interface ReviewSummarySubmissionContentType {
  allSteps: ReviewStepWithStateType[];
  courseReview: ReviewListEntry;
  courseEvaluation: CourseEvaluationDetailEntry;
  isReadOnly?: boolean;
}
const ReviewSummarySubmissionContent = (props: ReviewSummarySubmissionContentType) => {
  const { allSteps, courseReview, courseEvaluation, isReadOnly } = props;

  return (
    <>
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
      {isReadOnly && (
        <StepWrapper cardTitle={`Step 4 - ${allSteps[3].stepName}`}>
          <TextField
            margin="dense"
            id="final_comment"
            label="Final Comment"
            fullWidth
            variant="outlined"
            multiline
            disabled
            value={courseReview.final_comment}
          />
        </StepWrapper>
      )}
    </>
  );
};

ReviewSummarySubmissionContent.defaultProps = {
  isReadOnly: true,
};

export default ReviewSummarySubmissionContent;
