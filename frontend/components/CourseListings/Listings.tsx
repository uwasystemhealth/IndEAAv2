import React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { API_ENDPOINT, CourseEvaluationListEntry } from 'utils/api';
import useSWRAuth from '@/components/hooks/useSWRAuth';
import CoordinatorList from './CoordinatorList';
import CustomTheme from '../utils/CustomTheme';
import TabPanel, { a11yProps } from '../Custom/TabPanel';

const Listings = () => {
  const [tabsValue, setTabsValue] = React.useState(0);

  const { response } = useSWRAuth(API_ENDPOINT.COURSE_EVALUATION.LIST);
  const courseEvaluationListEntries = ((response?.data as unknown) ||
    []) as CourseEvaluationListEntry[];

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  // under the review list branch this should be changed to something similar to courseEvaluationListEntries
  const reviews: string[] = [];

  return (
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box sx={{ backgroundColor: CustomTheme.palette.primary.light, width: '100%' }}>
        <Tabs value={tabsValue} onChange={handleChangeTab} variant="fullWidth">
          {courseEvaluationListEntries.length > 0 && (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <Tab label="COURSE EVALUATIONS" {...a11yProps(0)} />
          )}
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {reviews.length > 0 && <Tab label="REVIEW COURSES" {...a11yProps(1)} />}
        </Tabs>
        <TabPanel value={tabsValue} index={0}>
          <CoordinatorList list={courseEvaluationListEntries} />
        </TabPanel>
        <TabPanel value={tabsValue} index={1}>
          Item Two
        </TabPanel>
      </Box>
    </Container>
  );
};

export default Listings;
