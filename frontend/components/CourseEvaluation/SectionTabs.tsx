import * as React from 'react';
import type { NextPage } from 'next';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import styles from '../styles/Home.module.css';
import { useContext } from 'react';
import { useRouter } from 'next/router';

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

const SectionTabs: NextPage = () => {
  // Change these data when this issue gets worked on. For now it just contains a demo of how to get user info

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
        sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#0E91AC', width: '90%' }}
      >
        <Tabs value={tabsValue} onChange={handleChangeTab} variant="fullWidth">
          <Tab label="OVERVIEW" {...a11yProps(0)} />
          <Tab label="JUSTIFICATIONS" {...a11yProps(1)} />
          <Tab label="DOCUMENTS" {...a11yProps(2)} />
          <Tab label="REVIEWS" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <Box sx={{ backgroundColor: '#EEEEEE', width: '100%' }}>
        <TabPanel value={tabsValue} index={0}>
          <Overview />
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
};

export default SectionTabs;
