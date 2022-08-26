import React, { useState } from 'react';
import {
  API_ENDPOINT,
  CourseEvaluationDetailEntry,
  DEFAULT_COURSE_EVALUTION_DETAIL_ENTRY,
  Document,
  EocGeneralEocSpecific,
} from 'utils/api';
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import useSWRAuth from '@/components/hooks/useSWRAuth';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Props = {
  eocSpecific: EocGeneralEocSpecific;
  handleClose: () => void;
};

const EditGeneralInformationModal = (props: Props) => {
  const { courseEvaluationId, document, handleClose } = props;
  const { response } = useSWRAuth(
    courseEvaluationId ? API_ENDPOINT.COURSE_EVALUATION.DETAIL(courseEvaluationId) : '',
  );

  const courseEvaluation = ((response?.data as unknown) ||
    DEFAULT_COURSE_EVALUTION_DETAIL_ENTRY) as CourseEvaluationDetailEntry;

  const eocGenerals = courseEvaluation.eoc_set.eoc_generals || [];
  const eocSpecifics: EocGeneralEocSpecific[] = courseEvaluation.eoc_set.eoc_generals.reduce(
    (previousValue, currentValue) => previousValue.concat(currentValue.eoc_specifics),
    [] as EocGeneralEocSpecific[],
  );
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
    }),
    onSubmit: async (values) => {
      const payload = {
        ...values,
        // Only need the IDs
        eoc_generals: values.eoc_generals.map((eocGeneral) => eocGeneral.id),
        eoc_specifics: values.eoc_specifics.map((eocSpecific) => eocSpecific.id),
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
    <Dialog fullWidth maxWidth="xl" open>
      <DialogTitle>EOC Number and Description</DialogTitle>
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
        ...
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => formik.handleSubmit()}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

EditGeneralInformationModal.defaultProps = {};

export default EditGeneralInformationModal;
