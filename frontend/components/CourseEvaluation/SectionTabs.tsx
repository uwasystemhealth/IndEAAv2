import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useSWRAuth } from '@/components/hooks/useSWRAuth';
import { API_ENDPOINT, CourseEvaluationListEntry } from 'utils/api';
import CustomTheme from '../utils/CustomTheme';

import TabPanel, { a11yProps } from '../Custom/TabPanel';
import Overview from './Overview';

type Props = {
  courseEvaluationId: string;
};

const SectionTabs = ({ courseEvaluationId }: Props) => {
  const { response, isLoading, error } = useSWRAuth(
    courseEvaluationId ? API_ENDPOINT.COURSE_EVALUATION.DETAIL(courseEvaluationId) : '',
  );

  const evaluation = ((response?.data as unknown) || []) as CourseEvaluationListEntry;

  const TAB_DISPLAYS = [
    {
      label: 'Overview',
      tabComponent: <Overview evaluation={evaluation} />,
    },
    { label: 'JUSTIFICATIONS', tabComponent: 'item two' },
    { label: 'DOCUMENTS', tabComponent: 'item three' },
    { label: 'REVIEWS', tabComponent: 'item four' },
  ];

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
          {TAB_DISPLAYS.map(({ label }, index) => (
            <Tab key={index} label={label} {...a11yProps(index)} />
          ))}
        </Tabs>

        {TAB_DISPLAYS.map(({ tabComponent }, index) => (
          <TabPanel key={index} value={tabsValue} index={index}>
            {tabComponent}
          </TabPanel>
        ))}
      </Box>
    </Container>
  );
};

export default SectionTabs;
