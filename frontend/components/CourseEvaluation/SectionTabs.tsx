import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import {
  API_ENDPOINT,
  CourseEvaluationDetailEntry,
  DEFAULT_COURSE_EVALUTION_DETAIL_ENTRY,
} from 'utils/api';
import useSWRAuth from '@/components/hooks/useSWRAuth';
import CustomTheme from '../utils/CustomTheme';

import TabPanel, { a11yProps } from '../Custom/TabPanel';
import Overview from './Overview';
import Justification from './Justification';
import Reviews from './Reviews';
import Documents from './Documents';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CampaignIcon from '@mui/icons-material/Campaign';

type Props = {
  courseEvaluationId: string;
};

const SectionTabs = ({ courseEvaluationId }: Props) => {
  const { response } = useSWRAuth(
    courseEvaluationId ? API_ENDPOINT.COURSE_EVALUATION.DETAIL(courseEvaluationId) : '',
  );

  const evaluation = ((response?.data as unknown) ||
    DEFAULT_COURSE_EVALUTION_DETAIL_ENTRY) as CourseEvaluationDetailEntry;

  const TAB_DISPLAYS = [
    {
      label: 'Overview',
      tabComponent: <Overview evaluation={evaluation} />,
      icon: AssignmentIcon,
    },
    { label: 'Documents', tabComponent: <Documents />, icon: ArticleIcon },
    { label: 'Justification', tabComponent: <Justification />, icon: CampaignIcon },
    { label: 'Reviews', tabComponent: <Reviews />, icon: RateReviewIcon },
  ];

  const [tabsValue, setTabsValue] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  return (
    <Container maxWidth="xl">
      <Tabs value={tabsValue} onChange={handleChangeTab} variant="fullWidth">
        {TAB_DISPLAYS.map(({ label, icon: Icon }, index) => (
          // eslint-disable-next-line react/no-array-index-key, react/jsx-props-no-spreading
          <Tab icon={<Icon />} key={index} label={label} {...a11yProps(index)} />
        ))}
      </Tabs>

      {TAB_DISPLAYS.map(({ tabComponent }, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <TabPanel key={index} value={tabsValue} index={index}>
          {tabComponent}
        </TabPanel>
      ))}
    </Container>
  );
};

export default SectionTabs;
