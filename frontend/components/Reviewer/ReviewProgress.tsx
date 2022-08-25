// React + Redux + Functionality
import React from 'react';
import { useRouter } from 'next/router';

// Material UI
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';

// Icons
import Done from '@mui/icons-material/CheckCircleOutline';
import NotDone from '@mui/icons-material/RadioButtonUnchecked';
import { ReviewListEntry } from 'utils/api';

// STYLES
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { Box } from '@mui/system';
import { determineStepsStateOfReview } from '../utils/reviews';

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));

const stepperStyle = {
  stepper: {
    backgroundColor: 'transparent',
    padding: '0px',
  },
  root: {
    backgroundColor: '#FEBF00',
    zIndex: 1,
    color: '#FFFFFF',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    backgroundImage:
      'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  },
};

export const StepIcon = (props: { done: Boolean }) => {
  const { done } = props;
  const icon = done ? <Done /> : <NotDone />;
  const isActiveStyle = done ? stepperStyle.active : {};
  return <Box sx={{ ...stepperStyle.root, ...isActiveStyle }}>{icon}</Box>;
};

type Props = {
  review: ReviewListEntry;
  isCoordinator?: Boolean;
};

const ReviewProgress = ({ review, isCoordinator }: Props) => {
  const router = useRouter();

  /**
   * A State of Review:
   * 0 (Viewed EOC)
   * 1 (Viewed or commented on a Document)
   * 2 (Commented on an EOC Specific)
   * 3 (Submitted the review)
   */
  const stateOfReview = determineStepsStateOfReview(review);
  const steps = [
    {
      stepName: 'Overview & Eoc',
      done: stateOfReview.step1,
      stepLink: 'overview-and-eoc',
    },
    {
      stepName: 'Read Documents',
      done: stateOfReview.step2,
      stepLink: 'documents',
    },

    {
      stepName: 'Review Course',
      done: stateOfReview.step3,
      stepLink: 'assessment',
    },

    {
      stepName: 'Review & Submit',
      done: stateOfReview.step4,
      stepLink: 'submit',
    },
  ];
  return (
    <Stepper alternativeLabel nonLinear connector={<ColorlibConnector />}>
      {steps.map(({ stepName, done = false, stepLink }, index) => (
        <Step key={stepName} active={done}>
          <StepButton
            icon={StepIcon({ done })}
            onClick={() =>
              !isCoordinator && router.push(`/review/${review.id}/${index + 1}-${stepLink}`)
            }
          >
            {stepName}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );
};

ReviewProgress.defaultProps = {
  isCoordinator: false,
};

export default ReviewProgress;
