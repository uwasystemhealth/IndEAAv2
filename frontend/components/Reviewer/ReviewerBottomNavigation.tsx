import React from 'react';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
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
