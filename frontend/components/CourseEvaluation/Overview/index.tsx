import * as React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { CourseEvaluationDetailEntry } from 'utils/api';
import CardHeader from '@mui/material/CardHeader';
import EditIcon from '@mui/icons-material/Edit';
import Fab from '@mui/material/Fab';
import { listOfUserDisplayNames } from '../../utils/generic';
import useModal from '@/components/hooks/useModal';
import EditGeneralInformationModal from './EditGeneralInformationModal';

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
        ></EditGeneralInformationModal>
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
              <Typography sx={{ p: 1, fontWeight: 'bold' }}>
                Course Description:
                <Typography variant="subtitle2">{evaluation.description}</Typography>
              </Typography>
              <Typography sx={{ p: 1, fontWeight: 'bold' }}>
                Coordinators:
                <Typography variant="subtitle2">
                  {listOfUserDisplayNames(evaluation.coordinators)}
                </Typography>
              </Typography>
              <Typography sx={{ p: 1, fontWeight: 'bold' }}>
                Date Started:
                <Typography variant="subtitle2">{dateString}</Typography>
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
            <CardContent>TODO</CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default Overview;
