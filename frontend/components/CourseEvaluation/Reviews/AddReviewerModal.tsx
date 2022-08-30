import React, { useState } from 'react';
import { API_ENDPOINT, CourseEvaluationDetailEntry } from 'utils/api';
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
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';

type Props = {
  handleClose: () => void;
};

const AddReviewerModal = (props: Props) => {
  const { handleClose } = props;
  const axios = useAuthenticatedAPIClient();
  const { mutate } = useSWRConfig();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      /* Note: The values here should match the field name in the models
        Otherwise, make it match in `onSubmit`
      */
      email: '',
    },
    validationSchema: Yup.object({
      // Email
      email: Yup.string().email('Invalid email address').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        console.log(values);
        // Flush SWR cache to refresh screen
        // mutate(url);

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
      <DialogTitle>Adding a new Reviewer</DialogTitle>
      {error && (
        <Alert variant="filled" severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      <DialogContent>
        <TextField
          margin="dense"
          id="email"
          label="Email of Reviewer"
          fullWidth
          variant="outlined"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.email)}
          helperText={formik.errors.email}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => formik.handleSubmit()}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddReviewerModal;
