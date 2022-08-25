/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Box from '@mui/material/Box';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import { CourseEvaluationDetailEntry, Document } from 'utils/api';
import DocumentCard from './DocumentCard';
import CreateEditDocumentModal from './CreateEditDocumentModal';
import useModal from '@/components/hooks/useModal';

type Props = {
  evaluation: CourseEvaluationDetailEntry;
};

const Documents = (props: Props) => {
  const { evaluation } = props;

  const createEditDocumentModalState = useModal();
  return (
    <>
      {createEditDocumentModalState.isOpen && (
        <CreateEditDocumentModal
          courseEvaluationId={evaluation.id}
          handleClose={createEditDocumentModalState.handleClose}
        />
      )}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          pb: 2,
        }}
      >
        <Stack spacing={2} direction="row">
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={createEditDocumentModalState.handleOpen}
          >
            Add New Document
          </Button>
        </Stack>
      </Box>
      <Grid container spacing={2}>
        {evaluation.documents.map((document) => (
          <Grid item md={4}>
            <DocumentCard document={document} isReadOnly={false} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Documents;
