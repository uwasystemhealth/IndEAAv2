import React, { useState } from 'react';
import { API_ENDPOINT, CourseEvaluationDetailEntry, Document } from 'utils/api';
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
  courseEvaluationId: string;
  document?: Document;
  handleClose: () => void;
};

const EditGeneralInformationModal = (props: Props) => {
  const { courseEvaluationId, document, handleClose } = props;
  const isEditMode = Boolean(document);

  const axios = useAuthenticatedAPIClient();
  const { mutate } = useSWRConfig();
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      /* Note: The values here should match the field name in the models
        Otherwise, make it match in `onSubmit`
      */
      name: document?.name || '',
      description: document?.description || '',
      url: document?.url || '',
      is_introduction: document?.is_introduction || false,
      eoc_generals: document?.eoc_generals || [],
      eoc_specifics: document?.eoc_specifics || [],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      url: Yup.string().url('Invalid URL'),
      is_introduction: Yup.boolean(),
      eoc_generals: Yup.array().of(Yup.string()),
      eoc_specifics: Yup.array().of(Yup.string()),
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
      };
      const url = isEditMode
        ? API_ENDPOINT.COURSE_EVALUATION.DOCUMENT.DETAIL(courseEvaluationId, document?.id || '')
        : API_ENDPOINT.COURSE_EVALUATION.DOCUMENT.LIST(courseEvaluationId);
      try {
        if (isEditMode) {
          await axios.patch(url, payload);
        } else {
          await axios.post(url, payload);
        }

        // Flush SWR cache to refresh screen
        mutate(API_ENDPOINT.COURSE_EVALUATION.DETAIL(courseEvaluationId));

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
      <DialogTitle>{isEditMode ? 'Editting Document - ' : 'Create a new Document'}</DialogTitle>
      {error && (
        <Alert variant="filled" severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      <DialogContent>ABC</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => formik.handleSubmit()}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

EditGeneralInformationModal.defaultProps = {
  document: null,
};

export default EditGeneralInformationModal;
