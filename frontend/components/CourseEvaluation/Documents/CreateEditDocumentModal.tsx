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
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

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
  console.log(formik.values);
  return (
    <Dialog fullWidth maxWidth="xl" open>
      <DialogTitle>
        {isEditMode ? `Editting Document - ${document?.name}` : 'Create a new Document'}
      </DialogTitle>
      {error && (
        <Alert variant="filled" severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Card>
          <CardHeader
            title="Document Details"
            subheader="These are the basic details of the document"
          />
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                gap: 2,
              }}
            >
              <TextField
                margin="dense"
                id="name"
                label="Document Name"
                fullWidth
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.name)}
                helperText={formik.errors.name}
              />
              <TextField
                margin="dense"
                id="url"
                label="Document Link"
                fullWidth
                variant="outlined"
                value={formik.values.url}
                onChange={formik.handleChange}
                error={Boolean(formik.errors.url)}
                helperText={formik.errors.url}
              />
            </Box>
            <TextField
              margin="dense"
              id="description"
              label="Document Description"
              fullWidth
              variant="outlined"
              multiline
              value={formik.values.description}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.description)}
              helperText={formik.errors.description}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.is_introduction}
                  onChange={formik.handleChange}
                  name="is_introduction"
                />
              }
              label="Is this an introduction document?"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader
            title="Document Tags"
            subheader="These are tags that aids to connect relevant Elements of Competency (EOC) to documents"
          />
          <CardContent>TODO</CardContent>
        </Card>
      </DialogContent>
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
