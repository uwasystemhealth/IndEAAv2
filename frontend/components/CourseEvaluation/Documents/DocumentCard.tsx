import React from 'react';
import { API_ENDPOINT, Document, ReviewDocument } from 'utils/api';
import Box from '@mui/material/Box';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { useSWRConfig } from 'swr';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CommentIcon from '@mui/icons-material/Comment';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import useModal from '@/components/hooks/useModal';
import CreateEditDocumentModal from '@/components/CourseEvaluation/Documents/CreateEditDocumentModal';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import AreYouSureModalButton from '@/components/utils/AreYouSureModalButton';

type Props = {
  document: Document;
  isReadOnly: boolean;

  // These two props should be passed in if `isReadOnly` is true.
  reviewId?: string;
  reviewDocument?: ReviewDocument;
};

export interface DocumentTag {
  key: string | number;
  avatarContent: React.ReactNode;
  label: string;
  // TODO: add color type
  color: any;
}
const DocumentCard = (props: Props) => {
  const { document, isReadOnly, reviewDocument, reviewId } = props;
  const axios = useAuthenticatedAPIClient();
  const { mutate } = useSWRConfig();

  /**
   * Section here is for document display
   */
  const tags: DocumentTag[] = [];
  document.eoc_generals.forEach((eoc) => {
    tags.push({
      key: eoc.number,
      avatarContent: <Avatar>{eoc.number}</Avatar>,
      label: `EOC`,
      color: 'primary',
    });
  });
  document.eoc_specifics.forEach((eoc) => {
    tags.push({
      key: eoc.general_and_specific_eoc,
      avatarContent: <Avatar>{eoc.general_and_specific_eoc}</Avatar>,
      label: `EOC`,
      color: 'secondary',
    });
  });

  // Sort tags by label
  tags.sort((a, b) => a.label.localeCompare(b.label));

  if (document.is_introduction) {
    // Add to the beginning
    tags.unshift({
      key: 'introduction',
      avatarContent: <Avatar>I</Avatar>,
      label: 'Introduction',
      color: 'info',
    });
  }

  /**
   * Section here: Coordinator View (isReadOnly = true)
   */
  const createEditDocumentModalState = useModal();
  const [documentSelected, setDocumentSelected] = React.useState<Document | undefined>(undefined);
  const handleDelete = async () => {
    try {
      await axios.delete(
        API_ENDPOINT.COURSE_EVALUATION.DOCUMENT.DETAIL(document.course_evaluation, document.id),
      );
      mutate(API_ENDPOINT.COURSE_EVALUATION.DETAIL(document.course_evaluation));
    } catch (error) {
      // TODO
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  /**
   * Section here: Reviewer View (isReadOnly = false)
   */

  const handleTogglingOfDocumentView = async () => {
    const urlToMutate = API_ENDPOINT.REVIEWS.DETAIL(reviewId || '');
    if (reviewDocument?.id) {
      // Edit Mode
      await axios.patch(
        API_ENDPOINT.REVIEWS.DOCUMENT.DETAIL(reviewDocument.review, reviewDocument.id),
        {
          is_viewed: !reviewDocument.is_viewed,
        },
      );
      mutate(urlToMutate);
    } else if (reviewId) {
      // Create Mode
      await axios.post(API_ENDPOINT.REVIEWS.DOCUMENT.LIST(reviewId), {
        is_viewed: true,
        document: document.id,
      });
      mutate(urlToMutate);
    } else {
      // This should not be used if there is no reviewId
      throw new Error('Invalid state');
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
            <Grid item sm={7}>
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
                  <Chip
                    key={tag.key}
                    label={tag.label}
                    avatar={tag.avatarContent}
                    color={tag.color}
                    size="small"
                  />
                ))}
              </Box>
            </Grid>
            <Grid item sm={5}>
              <Stack direction="column" spacing={2}>
                <Button
                  startIcon={<VisibilityIcon />}
                  variant="outlined"
                  color="primary"
                  onClick={() => window.open(document.url)}
                >
                  View
                </Button>
                {isReadOnly ? (
                  <>
                    <Button
                      startIcon={<BookmarkAddedIcon />}
                      variant={reviewDocument?.is_viewed ? 'contained' : 'outlined'}
                      color="secondary"
                      onClick={handleTogglingOfDocumentView}
                    >
                      {reviewDocument?.is_viewed ? 'Mark as Unviewed' : 'Mark as Viewed'}
                    </Button>
                    <Button
                      startIcon={<CommentIcon />}
                      variant="outlined"
                      color="secondary"
                      onClick={() => {}}
                    >
                      Comment
                    </Button>
                  </>
                ) : (
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

DocumentCard.defaultProps = {
  reviewId: undefined,
  reviewDocument: undefined,
};

export default DocumentCard;
