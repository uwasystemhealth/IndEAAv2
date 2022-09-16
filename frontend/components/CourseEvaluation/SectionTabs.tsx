import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CampaignIcon from '@mui/icons-material/Campaign';

import TabPanel, { a11yProps } from '../Custom/TabPanel';
import Overview from './Overview';
import Justification from './Justifications';
import Reviews from './Reviews';
import Documents from './Documents';
import useCourseEvaluation from '../hooks/useCourseEvaluation';

const SectionTabs = () => {
  const { courseEvaluation } = useCourseEvaluation();

  const TAB_DISPLAYS = [
    {
      label: 'Overview',
      tabComponent: <Overview evaluation={courseEvaluation} />,
      icon: AssignmentIcon,
    },
    {
      label: 'Documents',
      tabComponent: <Documents evaluation={courseEvaluation} />,
      icon: ArticleIcon,
    },
    {
      label: 'Justification',
      tabComponent: <Justification evaluation={courseEvaluation} />,
      icon: CampaignIcon,
    },
    {
      label: 'Reviews',
      tabComponent: <Reviews evaluation={courseEvaluation} />,
      icon: RateReviewIcon,
    },
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
