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

import Overview from './Overview';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

type Props = {
  id: string;
};

function SectionTabs({ id }: Props) {
  const { response, isLoading, error } = useSWRAuth(API_ENDPOINT.COURSE_EVALUATION.LIST);
  const courseEvaluationListEntries = ((response?.data as unknown) ||
    []) as CourseEvaluationListEntry[];
  let store: CourseEvaluationListEntry = DEFAULT_COURSE_EVALUATION_LIST_ENTRY;
  courseEvaluationListEntries.forEach(function (value) {
    if (value.id == id) {
      store = value;
      return;
    }
  });

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
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          backgroundColor: CustomTheme.palette.info.main,
          width: '100%',
        }}
      >
        <Tabs value={tabsValue} onChange={handleChangeTab} variant="fullWidth">
          <Tab label="OVERVIEW" {...a11yProps(0)} />
          <Tab label="JUSTIFICATIONS" {...a11yProps(1)} />
          <Tab label="DOCUMENTS" {...a11yProps(2)} />
          <Tab label="REVIEWS" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <Box sx={{ backgroundColor: CustomTheme.palette.primary.light, width: '100%' }}>
        <TabPanel value={tabsValue} index={0}>
          <Overview evaluation={store} />
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
