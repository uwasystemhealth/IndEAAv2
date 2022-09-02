import React from 'react';
import { EocGeneralEocSpecific, ReviewListEntry } from 'utils/api';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Divider, useTheme } from '@mui/material';
import { developmentLevelToString } from '@/components/utils/eoc';
import { getReviewerAssessment } from '@/components/utils/reviews';

type Props = {
  eocSpecific: EocGeneralEocSpecific;
  handleSelectEOCSpecific: (eocSpecific: EocGeneralEocSpecific) => void;

  // This is useful for Reviewer
  review?: ReviewListEntry;
};

const EOCCard = (props: Props) => {
  const { eocSpecific, handleSelectEOCSpecific, review } = props;
  // Business rule: There can only be one justification per EOC
  const coordinatorJustification = eocSpecific?.justification[0];
  const theme = useTheme();

  const isReviewerDisplay = review;
  const reviewerAssessment = isReviewerDisplay
    ? getReviewerAssessment(review, eocSpecific)
    : undefined;

  const developmentLevel = isReviewerDisplay
    ? reviewerAssessment?.development_level || 0
    : coordinatorJustification?.development_level || 0;

  const justificationText = isReviewerDisplay
    ? reviewerAssessment?.justification
    : coordinatorJustification?.justification;

  return (
    <Card>
      <CardContent>
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item sm={8}>
            <Typography gutterBottom variant="h5" component="div">
              EOC {eocSpecific.general_and_specific_eoc}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {eocSpecific.description}
            </Typography>
          </Grid>
          <Grid item sm={3}>
            <Stack direction="column" spacing={2}>
              <Button
                startIcon={<VisibilityIcon />}
                variant="outlined"
                color="primary"
                onClick={() => {
                  handleSelectEOCSpecific(eocSpecific);
                }}
              >
                View
              </Button>
            </Stack>
          </Grid>
        </Grid>
        <Divider sx={{ m: 2 }} />
        <Box>
          <Box
            sx={{
              // Development level that have no selection is 0 by default
              color: developmentLevel ? theme.palette.secondary.main : theme.palette.error.main,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', pb: 1, pr: 1 }} color="success">
              Your Rating:
            </Typography>
            <Typography variant="body2" gutterBottom>
              {developmentLevelToString[developmentLevel]}
            </Typography>
          </Box>
          <Box
            sx={{
              color: justificationText ? theme.palette.secondary.main : theme.palette.error.main,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 'bold', pb: 1, pr: 1 }} color="success">
              Your Justification:
            </Typography>
            <Typography variant="body2" gutterBottom>
              {justificationText || 'None'}
            </Typography>
          </Box>
          {isReviewerDisplay && (
            <Box
              sx={{
                color: reviewerAssessment?.suggestion
                  ? theme.palette.secondary.main
                  : theme.palette.error.main,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 'bold', pb: 1, pr: 1 }} color="success">
                Your Suggestion
              </Typography>
              <Typography variant="body2" gutterBottom>
                {reviewerAssessment?.suggestion || 'None'}
              </Typography>
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

EOCCard.defaultProps = {
  review: undefined,
};

export default EOCCard;
