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
  evaluation: CourseEvaluationDetailEntry;
  handleClose: () => void;
};

const EditGeneralInformationModal = (props: Props) => {
  const { evaluation, handleClose } = props;
  const axios = useAuthenticatedAPIClient();
  const { mutate } = useSWRConfig();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      /* Note: The values here should match the field name in the models
        Otherwise, make it match in `onSubmit`
      */
      unit_code: evaluation?.unit_code || '',
      description: evaluation?.description || '',
    },
    validationSchema: Yup.object({
      unit_code: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const url = API_ENDPOINT.COURSE_EVALUATION.DETAIL(evaluation?.id);
        await axios.patch(url, values);

        // Flush SWR cache to refresh screen
        mutate(url);

        handleClose();
        // eslint-disable-next-line @typescript-eslint/no-shadow
      } catch (error) {
        // @ts-ignore
        setError(error?.message || 'Something went wrong');
      }
    },
  });
  return (
    <Dialog fullWidth maxWidth="xl" open onClose={handleClose}>
      <DialogTitle>Editing - {evaluation?.unit_code}</DialogTitle>
      {error && (
        <Alert variant="filled" severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      <DialogContent>
        <TextField
          margin="dense"
          id="unit_code"
          label="Unit Code"
          fullWidth
          variant="standard"
          value={formik.values.unit_code}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.unit_code)}
          helperText={formik.errors.unit_code}
        />
        <TextField
          margin="dense"
          id="description"
          label="Description"
          fullWidth
          variant="standard"
          multiline
          value={formik.values.description}
          onChange={formik.handleChange}
          error={Boolean(formik.errors.description)}
          helperText={formik.errors.description}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => formik.handleSubmit()}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditGeneralInformationModal;
