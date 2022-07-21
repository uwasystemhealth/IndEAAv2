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
import Stack from '@mui/material/Stack';
import { CourseEvaluationListEntry } from 'utils/api';
import { Reviews } from '@mui/icons-material';
import { useRouter } from 'next/router';

type Props = {
  list: CourseEvaluationListEntry[];
};

function EvaluationList({ list }: Props) {
    
  const router = useRouter();


  const viewDetail = () => {
    router.push('/course-evaluation');
  };

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          pb: 2,
        }}
      >
        <Stack spacing={2} direction="row">
          <Button variant="contained" sx={{ backgroundColor: '#808080' }}>
            SHOW COMPLETED
          </Button>
          <Button variant="contained" sx={{ backgroundColor: '#00BCD4' }}>
            CREATE NEW EVALUATION
          </Button>
        </Stack>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {list.map((courseEvaluationListEntry) => (
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
                  {courseEvaluationListEntry.coordinators.map((coordinator, i) => (
                    <Typography key={i}>{coordinator.username}</Typography>
                  ))}
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
                  <Button
                    variant="contained"
                    onClick={viewDetail}
                    sx={{ backgroundColor: '#F67B2F' }}
                  >
                    View
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default EvaluationList;
