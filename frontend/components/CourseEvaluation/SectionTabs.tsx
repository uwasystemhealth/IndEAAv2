import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useSWRAuth } from '@/components/hooks/useSWRAuth';
import {
  API_ENDPOINT,
  CourseEvaluationListEntry,
  DEFAULT_COURSE_EVALUATION_LIST_ENTRY,
} from 'utils/api';
import CustomTheme from '../utils/CustomTheme';

import TabPanel, {a11yProps} from "../Custom/TabPanel"
import Overview from './Overview';


type Props = {
  courseEvaluationId: string;
};

function SectionTabs({ courseEvaluationId }: Props) {

  const { response, isLoading, error } = useSWRAuth( courseEvaluationId ? API_ENDPOINT.COURSE_EVALUATION.DETAIL(courseEvaluationId) : "" );

  const evaluation = ((response?.data as unknown) ||
    []) as CourseEvaluationListEntry;

  const [tabsValue, setTabsValue] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

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
        <Tabs
          value={tabsValue}
          onChange={handleChangeTab}
          variant="fullWidth"
          sx={{ backgroundColor: CustomTheme.palette.info.main }}
        >
          <Tab label="OVERVIEW" {...a11yProps(0)} />
          <Tab label="JUSTIFICATIONS" {...a11yProps(1)} />
          <Tab label="DOCUMENTS" {...a11yProps(2)} />
          <Tab label="REVIEWS" {...a11yProps(3)} />
        </Tabs>
        <TabPanel value={tabsValue} index={0}>
          <Overview evaluation={evaluation} />
        </TabPanel>
        <TabPanel value={tabsValue} index={1}>
          Item Two
        </TabPanel>
        <TabPanel value={tabsValue} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={tabsValue} index={3}>
          Item Four
        </TabPanel>
      </Box>
    </Container>
  );
}

export default SectionTabs;
