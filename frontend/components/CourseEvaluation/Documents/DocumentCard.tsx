import React from 'react';
import { API_ENDPOINT, Document } from 'utils/api';
import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import useModal from '@/components/hooks/useModal';
import CreateEditDocumentModal from '@/components/CourseEvaluation/Documents/CreateEditDocumentModal';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import AreYouSureModalButton from '@/components/utils/AreYouSureModalButton';
import { useSWRConfig } from 'swr';

type Props = {
  document: Document;
  isReadOnly: boolean;
};

export interface DocumentTag {
  label: string;
  // TODO: add color type
  color: any;
}
const DocumentCard = (props: Props) => {
  const { document, isReadOnly } = props;

  const tags: DocumentTag[] = [];

  document.eoc_generals.forEach((eoc) => {
    tags.push({
      label: `EOC ${eoc.number}`,
      color: 'primary',
    });
  });
  document.eoc_specifics.forEach((eoc) => {
    tags.push({
      label: `EOC ${eoc.general_and_specific_eoc}`,
      color: 'secondary',
    });
  });

  // Sort tags by label
  tags.sort((a, b) => a.label.localeCompare(b.label));

  if (document.is_introduction) {
    // Add to the beginning
    tags.unshift({
      label: 'Introduction',
      color: 'info',
    });
  }

  const createEditDocumentModalState = useModal();
  const [documentSelected, setDocumentSelected] = React.useState<Document | undefined>(undefined);

  const axios = useAuthenticatedAPIClient();
  const { mutate } = useSWRConfig();

  const handleDelete = async () => {
    try {
      await axios.delete(
        API_ENDPOINT.COURSE_EVALUATION.DOCUMENT.DETAIL(document.course_evaluation, document.id),
      );
      mutate(API_ENDPOINT.COURSE_EVALUATION.DETAIL(document.course_evaluation));
    } catch (error) {
      // TODO
      console.error(error);
    }
  };
  return (
    <>
      {createEditDocumentModalState.isOpen && (
        <CreateEditDocumentModal
          courseEvaluationId={document.course_evaluation}
          handleClose={() => {
            setDocumentSelected(undefined);
            createEditDocumentModalState.handleClose();
          }}
          document={documentSelected}
        />
      )}
      <Card>
        <CardContent>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item md={8}>
              <Typography gutterBottom variant="h5" component="div">
                {document.name}
              </Typography>
              <Typography>{document.description}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: 1,
                  mt: 1,
                }}
              >
                {tags.map((tag) => (
                  <Chip key={tag.label} label={tag.label} color={tag.color} />
                ))}
              </Box>
            </Grid>
            <Grid item md={3}>
              <Stack direction="column" spacing={2}>
                <Button
                  startIcon={<AddIcon />}
                  variant="outlined"
                  color="primary"
                  onClick={() => window.open(document.url)}
                >
                  View
                </Button>
                {!isReadOnly && (
                  <>
                    <Button
                      startIcon={<EditIcon />}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {
                        setDocumentSelected(document);
                        createEditDocumentModalState.handleOpen();
                      }}
                    >
                      Edit
                    </Button>
                    <AreYouSureModalButton
                      action={handleDelete}
                      buttonProps={{
                        variant: 'outlined',
                        color: 'error',
                        startIcon: <DeleteIcon />,
                      }}
                    >
                      Delete
                    </AreYouSureModalButton>
                  </>
                )}
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  );
};

export default DocumentCard;
