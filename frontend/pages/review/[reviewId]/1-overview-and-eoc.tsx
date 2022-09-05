import React, { useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { API_ENDPOINT } from 'utils/api';
import { useSWRConfig } from 'swr';
import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import DocumentCard from '@/components/CourseEvaluation/Documents/DocumentCard';
import { listOfUserDisplayNames } from '@/components/utils/generic';
import EOCAccordionForRefresher from '@/components/Reviewer/OverviewAndEOC/EOCAccordionForRefresher';
import ReviewerBottomNavigation from '@/components/Reviewer/ReviewerBottomNavigation';
import { getReviewStepsWithState } from '@/components/utils/reviews';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';

const OverviewAndEOC = () => {
  const { courseReview } = useCourseReview();

  // set document title to unit code
  useEffect(() => {
    document.title = courseReview.course_evaluation.unit_code;
  }, []);

  const { courseEvaluation } = useCourseEvaluation(courseReview.course_evaluation.id);

  const STEP_INDEX = 0;
  const stepDetails = getReviewStepsWithState(courseReview)[STEP_INDEX];
  /**
   * When we finish on this page, there should be an API interaction to update that the user has started the review
   */
  const axios = useAuthenticatedAPIClient();
  const { mutate } = useSWRConfig();
  const handleSubmit = async () => {
    try {
      const url = API_ENDPOINT.REVIEWS.DETAIL(courseReview.id);
      await axios.patch(url, {
        eoc_date_viewed: new Date(),
      });
      mutate(url);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      // TODO: Display error in a more user-friendly way
    }
  };
  return (
    <BodyCard>
      <ReviewProgress review={courseReview} />
      <AboutStepCard stepIndex={0} />
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
        <Card>
          <CardHeader
            title="Background Information"
            subheader="These are the information and documents that gives context of the course being evaluated."
          />
          <CardContent>
            <Container maxWidth="xl">
              <Typography sx={{ p: 1, fontWeight: 'bold' }}>Course Description:</Typography>
              <Typography sx={{ p: 1 }} variant="subtitle2">
                {courseEvaluation.description}
              </Typography>
              <Typography sx={{ p: 1, fontWeight: 'bold' }}>
                Coordinators:
                <Typography sx={{ p: 1 }} component="span" variant="subtitle2">
                  {listOfUserDisplayNames(courseEvaluation.coordinators)}
                </Typography>
              </Typography>
              <Typography sx={{ p: 1, fontWeight: 'bold' }}>Introduction Documents:</Typography>
              <Grid container spacing={2}>
                {courseEvaluation.documents
                  .filter((document) => document.is_introduction)
                  .map((document) => (
                    <Grid item key={document.id} xs={12} sm={6}>
                      <DocumentCard document={document} isReadOnly />
                    </Grid>
                  ))}
              </Grid>
            </Container>
          </CardContent>
        </Card>
      </Container>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
        <Card>
          <CardHeader
            title="Elements of Competency (EOC)"
            subheader="These are the EOCs with their indicator of attainment. These are just a refresher and will be displayed again while reviewing the individual EOCs."
          />
          <CardContent>
            <Container maxWidth="xl">
              {courseEvaluation.eoc_set.eoc_generals.map((eocGeneral) => (
                <EOCAccordionForRefresher key={eocGeneral.id} eocGeneral={eocGeneral} />
              ))}
            </Container>
          </CardContent>
        </Card>
      </Container>
      <ReviewerBottomNavigation nextLink={stepDetails.nextStep} handleSubmit={handleSubmit} />
    </BodyCard>
  );
};

export default OverviewAndEOC;
