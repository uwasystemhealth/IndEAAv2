import React from 'react';
import { useSWRAuth } from '@/components/hooks/useSWRAuth';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { CourseEvaluationListEntry } from 'utils/api';
import { Reviews } from '@mui/icons-material';

type Props = {
  evaluations: CourseEvaluationListEntry[];
  reviews: String[];
};

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

function EvaluationList({ evaluations, reviews }: Props) {
  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
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
        {evaluations.length > 0 && reviews.length > 0 ? (
          <Tabs value={value} onChange={handleChangeTab} variant="fullWidth">
            <Tab label="COURSE EVALUATIONS" {...a11yProps(0)} />
            <Tab label="REVIEW COURSES" {...a11yProps(1)} />
          </Tabs>
        ) : evaluations.length > 0 ? (
          <Tabs value={value} onChange={handleChangeTab} variant="fullWidth">
            <Tab label="COURSE EVALUATIONS" {...a11yProps(0)} />{' '}
          </Tabs>
        ) : (
          <Tabs value={value} onChange={handleChangeTab} variant="fullWidth">
            <Tab label="Reviews" {...a11yProps(0)} />
          </Tabs>
        )}
      </Box>
      <Box sx={{ backgroundColor: '#EEEEEE', width: '100%' }}>
        <TabPanel value={value} index={0}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {evaluations.map((courseEvaluationListEntry) => (
              <Card key={courseEvaluationListEntry.id}>
                <CardContent>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Box>
                      <Typography gutterBottom variant="h5" component="div">
                        {courseEvaluationListEntry.unit_code}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {courseEvaluationListEntry.description}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      <Button>View</Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </TabPanel>
        <TabPanel value={value} index={1}>
          Item Two
        </TabPanel>
      </Box>
    </Container>
  );
}

export default EvaluationList;
