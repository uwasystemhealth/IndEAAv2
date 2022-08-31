import React from 'react';
import useCourseReview from '@/components/hooks/useCourseReview';
import AboutStepCard from '@/components/Reviewer/AboutStepCard';
import ReviewProgress from '@/components/Reviewer/ReviewProgress';
import BodyCard from '@/components/utils/BodyCard';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import DocumentCard from '@/components/CourseEvaluation/Documents/DocumentCard';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { listOfUserDisplayNames } from '@/components/utils/generic';
import EOCAccordion from '@/components/CourseEvaluation/Justifications/EOCAccordion';

const OverviewAndEOC = () => {
  const { courseReview } = useCourseReview();
  const { courseEvaluation } = useCourseEvaluation(courseReview.course_evaluation.id);

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
            </Container>
          </CardContent>
        </Card>
      </Container>
    </BodyCard>
  );
};

export default OverviewAndEOC;
