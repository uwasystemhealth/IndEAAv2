import React, { useState } from 'react';
import { API_ENDPOINT, Document } from 'utils/api';
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
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import { compileAllTheEOCSpecificsOfAnEOCSet } from '@/components/utils/eoc';
import useCourseEvaluation from '@/components/hooks/useCourseEvaluation';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Props = {
  // The reason why we cannot just use `document.courseEvaluation` is that we may use `create` functionality which means we don't have the course evaluation id.
  courseEvaluationId: string;
  document?: Document;
  handleClose: () => void;
};

const EditGeneralInformationModal = (props: Props) => {
  const { courseEvaluationId, document, handleClose } = props;
  const { courseEvaluation } = useCourseEvaluation();

  const eocGenerals = courseEvaluation.eoc_set.eoc_generals || [];
  const eocSpecifics = compileAllTheEOCSpecificsOfAnEOCSet(courseEvaluation.eoc_set);
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
      <DialogTitle>
        {isEditMode ? `Editting Document - ${document?.name}` : 'Create a new Document'}
      </DialogTitle>
      {error && (
        <Alert variant="filled" severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      )}
      <DialogContent>
        <Card
          sx={{
            mt: 2,
            mb: 2,
          }}
        >
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
        <Card
          sx={{
            mt: 2,
            mb: 2,
          }}
        >
          <CardHeader
            title="Document Tags"
            subheader="These are tags that aids to connect relevant Elements of Competency (EOC) to documents"
          />
          <CardContent>
            <Autocomplete
              multiple
              id="eoc_generals"
              options={eocGenerals}
              disableCloseOnSelect
              getOptionLabel={(option) => `EOC ${option.number} (${option.title})`}
              onChange={(e, value) => formik.setFieldValue('eoc_generals', value)}
              value={formik.values.eoc_generals}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              // eslint-disable-next-line @typescript-eslint/no-shadow
              renderOption={(props, option, { selected }) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {`EOC ${option.number} (${option.title})`}
                </li>
              )}
              renderInput={(params) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} fullWidth label="EOC General Tags" />
              )}
              sx={{
                m: 2,
              }}
            />
            <Autocomplete
              multiple
              id="eoc_specifics"
              options={eocSpecifics}
              disableCloseOnSelect
              getOptionLabel={(option) =>
                `EOC ${option.general_and_specific_eoc} (${option.description})`
              }
              onChange={(e, value) => formik.setFieldValue('eoc_specifics', value)}
              value={formik.values.eoc_specifics}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              // eslint-disable-next-line @typescript-eslint/no-shadow
              renderOption={(props, option, { selected }) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {`EOC ${option.general_and_specific_eoc} (${option.description})`}
                </li>
              )}
              renderInput={(params) => (
                // eslint-disable-next-line react/jsx-props-no-spreading
                <TextField {...params} fullWidth label="EOC Specific Tags" />
              )}
              sx={{
                m: 2,
              }}
            />
          </CardContent>
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
