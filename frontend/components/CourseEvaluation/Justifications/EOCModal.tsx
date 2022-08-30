import React, { useState } from 'react';
import {
  API_ENDPOINT,
  CourseEvaluationDetailEntry,
  EocGeneralEocSpecific,
  EocSetEocGeneral,
  Justification,
} from 'utils/api';
import Grid from '@mui/material/Grid';

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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import MenuItem from '@mui/material/MenuItem';
import { Typography } from '@mui/material';
import useAuthenticatedAPIClient from '@/components/hooks/useAuthenticatedAPIClient';
import { compileAllTheEOCSpecificsOfAnEOCSet, DEVELOPMENT_LEVEL } from '@/components/utils/eoc';
import EOCDocumentsViewer from './EOCDocumentsViewer';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Props = {
  eocGeneral: EocSetEocGeneral;
  eocSpecific: EocGeneralEocSpecific;
  courseEvaluation: CourseEvaluationDetailEntry;
  handleClose: () => void;
};

const EOCModal = (props: Props) => {
  const { eocGeneral, eocSpecific, courseEvaluation, handleClose } = props;
  // Business rule: There can only be one justification per EOC
  const justification = eocSpecific?.justification[0];

  // This modal can be used to create a new justification or edit an existing one.
  // This will determine what type of request we have to do to the API.
  const isCreateMode = !justification;

  const axios = useAuthenticatedAPIClient();
  const { mutate } = useSWRConfig();
  const [error, setError] = useState('');

  const eocSpecifics = compileAllTheEOCSpecificsOfAnEOCSet(courseEvaluation.eoc_set);
  const eocSpecificsIdAsKey = eocSpecifics.reduce((acc, eocSpecificToReduce) => {
    acc[eocSpecificToReduce.id] = eocSpecificToReduce;
    return acc;
  }, {} as { [key: number]: EocGeneralEocSpecific });

  const formik = useFormik({
    initialValues: {
      /* Note: The values here should match the field name in the models
        Otherwise, make it match in `onSubmit`
      */
      justification: justification?.justification || '',
      development_level: justification?.development_level || null,
      // The justification is a list of EOC specific ids, but we need to match the type to display properly in the autocomplete
      eoc_specifics:
        justification?.eoc_specifics?.map((eocSpecificId) => eocSpecificsIdAsKey[eocSpecificId]) ||
        [],
    },
    validationSchema: Yup.object({
      justification: Yup.string().required('Justification is required'),
      development_level: Yup.number().required('Development level is required'),
    }),
    onSubmit: async (values) => {
      try {
        if (isCreateMode) {
          await axios.post(API_ENDPOINT.COURSE_EVALUATION.JUSTIFICATION.LIST(courseEvaluation.id), {
            ...values,
            eoc_specifics: values.eoc_specifics.map(
              (eocSpecificAsPayload) => eocSpecificAsPayload.id,
            ),
          });
        } else {
          await axios.patch(
            API_ENDPOINT.COURSE_EVALUATION.JUSTIFICATION.DETAIL(
              courseEvaluation.id,
              (justification as Justification).id,
            ),
            {
              ...values,
              eoc_specifics: values.eoc_specifics.map(
                (eocSpecificAsPayload) => eocSpecificAsPayload.id,
              ),
            },
          );
        }

        // Update the cache
        mutate(API_ENDPOINT.COURSE_EVALUATION.DETAIL(courseEvaluation.id));
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
        EOC {eocSpecific.general_and_specific_eoc} - {eocSpecific.description}
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        {error && (
          <Alert variant="filled" severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid item sm={12} md={6}>
            <Card>
              <CardHeader
                title="Justify the EOC"
                subheader="This is where you can select the EOC "
              />
              <CardContent>
                <TextField
                  margin="dense"
                  id="development_level"
                  name="development_level"
                  label="Development Level"
                  fullWidth
                  variant="outlined"
                  value={formik.values.development_level}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.development_level)}
                  helperText={formik.errors.development_level}
                  select
                >
                  {DEVELOPMENT_LEVEL.map((obj) => (
                    <MenuItem
                      key={obj.value}
                      value={obj.value}
                      sx={{
                        display: 'block',
                      }}
                    >
                      <Typography variant="body1">
                        Level {obj.value} - {obj.short}
                      </Typography>
                      <Typography variant="caption" sx={{ mt: 5 }}>
                        {obj.meaning}
                      </Typography>
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  margin="dense"
                  id="justification"
                  label="Justify the Development Level"
                  fullWidth
                  variant="outlined"
                  value={formik.values.justification}
                  onChange={formik.handleChange}
                  error={Boolean(formik.errors.justification)}
                  helperText={formik.errors.justification}
                  multiline
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
                    <TextField
                      margin="dense"
                      // eslint-disable-next-line react/jsx-props-no-spreading
                      {...params}
                      fullWidth
                      label="EOC of Application"
                      helperText="This is where you select the EOCs that you want to apply the justification and development level to"
                    />
                  )}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item sm={12} md={6}>
            <Card>
              <CardHeader
                title="Supporting Documents"
                subheader="This is where you can see the documents that are aligned to this EOC. This will also be shown to the reviewer."
              />
              <CardContent>
                <EOCDocumentsViewer
                  documents={courseEvaluation.documents}
                  eocGeneralToFilter={eocGeneral}
                  eocSpecificToFilter={eocSpecific}
                />
              </CardContent>
            </Card>
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

EOCModal.defaultProps = {};

export default EOCModal;
