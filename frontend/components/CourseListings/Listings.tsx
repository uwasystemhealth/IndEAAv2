import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { API_ENDPOINT, CourseEvaluationListEntry, ReviewListEntry } from 'utils/api';
import useSWRAuth from '@/components/hooks/useSWRAuth';
import CoordinatorList from './CoordinatorList';
import CustomTheme from '../utils/CustomTheme';
import TabPanel, { a11yProps } from '../Custom/TabPanel';
import ReviewList from './ReviewList';
import roleIcons from '../utils/roleIcons';

const Listings = () => {
  const [tabsValue, setTabsValue] = React.useState(0);

  const { response: courseEvaluationResponse } = useSWRAuth(API_ENDPOINT.COURSE_EVALUATION.LIST);
  const courseEvaluationListEntries = ((courseEvaluationResponse?.data?.results as unknown) ||
    []) as CourseEvaluationListEntry[];
  const { response: reviewsResponse } = useSWRAuth(API_ENDPOINT.REVIEWS.LIST);
  const reviewListEntries = ((reviewsResponse?.data?.results as unknown) ||
    []) as ReviewListEntry[];

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  return (
    <Container>
      <Tabs value={tabsValue} onChange={handleChangeTab} variant="fullWidth">
        {courseEvaluationListEntries.length > 0 && (
          // eslint-disable-next-line react/jsx-props-no-spreading
          <Tab icon={<roleIcons.Coordinator />} label="Course Evaluation" {...a11yProps(0)} />
        )}
        {reviewListEntries.length > 0 && (
          /* eslint-disable-next-line react/jsx-props-no-spreading */
          <Tab icon={<roleIcons.Reviewer />} label="Review Courses" {...a11yProps(1)} />
        )}
      </Tabs>
      <TabPanel value={tabsValue} index={0}>
        <CoordinatorList list={courseEvaluationListEntries} />
      </TabPanel>
      <TabPanel value={tabsValue} index={1}>
        <ReviewList list={reviewListEntries} />
      </TabPanel>
    </Container>
  );
};

export default Listings;
