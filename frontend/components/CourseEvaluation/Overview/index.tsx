import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CourseEvaluationDetailEntry } from 'utils/api';
import CardHeader from '@mui/material/CardHeader';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import Stack from '@mui/material/Stack';
import useModal from '@/components/hooks/useModal';
import { listOfUserDisplayNames } from '../../utils/generic';
import EditGeneralInformationModal from './EditGeneralInformationModal';
import DocumentCard from '../Documents/DocumentCard';

type Props = {
  evaluation: CourseEvaluationDetailEntry;
};

const Overview = ({ evaluation }: Props) => {
  const dateString = evaluation.created_at?.slice(0, 10);

  const editEvaluationModalState = useModal();
  return (
    <>
      {editEvaluationModalState.isOpen && (
        <EditGeneralInformationModal
          evaluation={evaluation}
          handleClose={editEvaluationModalState.handleClose}
        />
      )}
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title="Information"
              subheader="This is where you can find general information about the review"
              action={
                <Fab
                  color="secondary"
                  aria-label="edit"
                  onClick={editEvaluationModalState.handleOpen}
                >
                  <EditIcon />
                </Fab>
              }
            />
            <CardContent>
              <Typography sx={{ p: 1, fontWeight: 'bold' }}>Course Description:</Typography>
              <Typography sx={{ p: 1 }} variant="subtitle2">
                {evaluation.description}
              </Typography>
              <Typography sx={{ p: 1, fontWeight: 'bold' }}>
                Coordinators:
                <Typography sx={{ p: 1 }} component="span" variant="subtitle2">
                  {listOfUserDisplayNames(evaluation.coordinators)}
                </Typography>
              </Typography>
              <Typography sx={{ p: 1, fontWeight: 'bold' }}>Date Started:</Typography>
              <Typography sx={{ p: 1 }} component="span" variant="subtitle2">
                {dateString}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card>
            <CardHeader
              title="Introduction Documents"
              subheader="These are the documents that the reviewer will see first. Tag it in the 'Documents' Section"
            />
            <CardContent>
              <Stack spacing={2}>
                {evaluation.documents
                  .filter((document) => document.is_introduction)
                  .map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      isReadOnly={false}
                      isReviewer={false}
                    />
                  ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Overview;
