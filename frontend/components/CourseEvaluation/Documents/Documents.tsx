/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import { CourseEvaluationDetailEntry } from 'utils/api';
import DocumentCard from './DocumentCard';

type Props = {
  evaluation: CourseEvaluationDetailEntry;
};

const Documents = (props: Props) => {
  const { evaluation } = props;
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          pb: 2,
        }}
      >
        <Stack spacing={2} direction="row">
          <Button startIcon={<AddIcon />} variant="contained" color="primary">
            Add New Document
          </Button>
        </Stack>
      </Box>
      <Grid container spacing={2}>
        {evaluation.documents.map((document) => (
          <Grid item md={4}>
            <DocumentCard document={document} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Documents;
