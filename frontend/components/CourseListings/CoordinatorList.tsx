import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Link from '@mui/material/Link';
import { CourseEvaluationListEntry } from 'utils/api';
import AddIcon from '@mui/icons-material/Add';
import { listOfUserDisplayNames } from '../utils/generic';

type Props = {
  list: CourseEvaluationListEntry[];
};

const CoordinatorList = ({ list }: Props) => (
  <>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        pb: 2,
      }}
    >
      <Stack spacing={2} direction="row">
        <Button startIcon={<AddIcon />} variant="contained" color="primary" disabled>
          Create new Evaluation
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
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                >
                  <Typography sx={{ fontWeight: 'bold', pb: 1, pr: 1 }}>Coordinators:</Typography>
                  <Typography>
                    {listOfUserDisplayNames(courseEvaluationListEntry.coordinators)}
                  </Typography>
                </Box>
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
                <Link href={`/course-evaluation/${courseEvaluationListEntry.id}`}>
                  <Button variant="contained" color="primary">
                    View
                  </Button>
                </Link>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  </>
);

export default CoordinatorList;
