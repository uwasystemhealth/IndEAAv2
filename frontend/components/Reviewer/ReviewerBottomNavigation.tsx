import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import DocumentCard from '@/components/CourseEvaluation/Documents/DocumentCard';
import { listOfUserDisplayNames } from '@/components/utils/generic';
import EOCAccordionForRefresher from '@/components/Reviewer/OverviewAndEOC/EOCAccordionForRefresher';
import { useRouter } from 'next/router';

type Props = {
  previousLink?: string;
  nextLink?: string;
  handleSubmit?: () => void;
};
const ReviewerBottomNavigation = (props: Props) => {
  const { previousLink, nextLink, handleSubmit } = props;

  const router = useRouter();
  const handlePrevious = () => {
    if (previousLink) {
      router.push(previousLink);
    }
  };
  const handleNext = () => {
    if (nextLink) {
      router.push(nextLink);
    }
    if (handleSubmit) {
      handleSubmit();
    }
  };

  //   If the previous link is not there, then we have to not show it
  const numberOfItems = previousLink ? 2 : 1;
  return (
    <Container
      maxWidth="xl"
      sx={{
        display: 'flex',
        justifyContent: numberOfItems > 1 ? 'space-between' : 'flex-end',
      }}
    >
      {previousLink && (
        <Button startIcon={<NavigateBeforeIcon />} variant="contained" onClick={handlePrevious}>
          Previous
        </Button>
      )}
      <Button endIcon={<NavigateNextIcon />} variant="contained" onClick={handleNext}>
        {nextLink ? 'Next' : 'Submit'}
      </Button>
    </Container>
  );
};

ReviewerBottomNavigation.defaultProps = {
  previousLink: '',
  nextLink: '',
  handleSubmit: () => {},
};

export default ReviewerBottomNavigation;
