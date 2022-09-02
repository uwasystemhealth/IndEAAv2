import React from 'react';
import { Document, ReviewListEntry } from 'utils/api';
import Box from '@mui/material/Box';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';

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
