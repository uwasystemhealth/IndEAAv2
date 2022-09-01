import React, { useState } from 'react';
import { API_ENDPOINT, Document, ReviewDocument } from 'utils/api';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSWRConfig } from 'swr';
import Alert from '@mui/material/Alert';
import Grid from '@mui/material/Grid';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';

type Props = {
  handleClose: () => void;
  document: Document;
  reviewId: string;
  reviewDocument?: ReviewDocument;
};

const EditReviewDocumentCommentModal = (props: Props) => {
  const { reviewId, document, reviewDocument, handleClose } = props;
  const isEditMode = Boolean(reviewDocument);

  const axios = useAuthenticatedAPIClient();
  const { mutate } = useSWRConfig();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      /* Note: The values here should match the field name in the models
        Otherwise, make it match in `onSubmit`
      */
      comment: reviewDocument?.comment || '',
    },
    validationSchema: Yup.object({
      comment: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      const payload = {
        comment: values.comment,
        is_viewed: true,
      };
      const url = isEditMode
        ? API_ENDPOINT.REVIEWS.DOCUMENT.DETAIL(
            reviewDocument?.review || '',
            reviewDocument?.id || '',
          )
        : API_ENDPOINT.REVIEWS.DOCUMENT.LIST(reviewId);
      try {
        if (isEditMode) {
          await axios.patch(url, payload);
        } else {
          await axios.post(url, {
            ...payload,
            document: document.id,
          });
        }
        // Flush SWR cache to refresh screen
        const urlToMutate = API_ENDPOINT.REVIEWS.DETAIL(reviewId || '');
        mutate(urlToMutate);

        handleClose();
        // eslint-disable-next-line @typescript-eslint/no-shadow
      } catch (error) {
        // @ts-ignore
        setError(error?.message || 'Something went wrong');
      }
    },
  });
  return (
    <Dialog fullWidth maxWidth="xl" open>
      <DialogTitle>Commenting on {document.name}</DialogTitle>
      {error && (
        <Alert variant="filled" severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              margin="dense"
              id="comment"
              label="Document comment"
              fullWidth
              variant="outlined"
              multiline
              value={formik.values.comment}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.comment)}
              helperText={formik.errors.comment}
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <iframe
              src={document.url}
              frameBorder="10"
              title="Document preview"
              style={{
                height: '80vh',
                width: '100%',
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => formik.handleSubmit()}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

EditReviewDocumentCommentModal.defaultProps = {
  reviewDocument: undefined,
};

export default EditReviewDocumentCommentModal;
