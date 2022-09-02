import React from 'react';
import { API_ENDPOINT, Document, ReviewListEntry } from 'utils/api';
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
import CardHeader from '@mui/material/CardHeader';
import useModal from '@/components/hooks/useModal';
import CreateEditDocumentModal from '@/components/CourseEvaluation/Documents/CreateEditDocumentModal';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import AreYouSureModalButton from '@/components/utils/AreYouSureModalButton';
import EditReviewDocumentCommentModal from '@/components/Reviewer/Documents/EditReviewDocumentCommentModal';

type Props = {
  document: Document;
  review: ReviewListEntry;
};

const SimplifiedDocumentCard = (props: Props) => {
  const { document, review } = props;

  const reviewDocument = review?.documents.find(
    (currentDocumentInIteration) => currentDocumentInIteration.document === document.id,
  );

  return (
    <Card>
      <CardHeader title={document.name} subheader={document.description} />
      <CardContent>
        <Box sx={{ color: reviewDocument?.is_viewed ? 'secondary.main' : 'error.main' }}>
          <Typography sx={{ p: 1, fontWeight: 'bold' }}>
            {reviewDocument?.is_viewed ? 'Marked as Viewed' : 'Marked as not yet viewed'}
          </Typography>
        </Box>
        <Box sx={{ color: reviewDocument?.comment ? 'secondary.main' : 'inherit' }}>
          <Typography sx={{ p: 1, fontWeight: 'bold' }}>Your comment (optional):</Typography>
          <Typography sx={{ p: 1 }} variant="subtitle2">
            {reviewDocument?.comment || 'None'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SimplifiedDocumentCard;
