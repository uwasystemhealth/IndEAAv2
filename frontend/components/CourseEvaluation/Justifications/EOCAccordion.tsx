import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import React from 'react';
import { EocSetEocGeneral } from 'utils/api';
import EOCCard from './EOCCard';

type Props = {
  eocGeneral: EocSetEocGeneral;
};

const EOCAccordion = ({ eocGeneral }: Props) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>{`EOC ${eocGeneral.number}: ${eocGeneral.title}`}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Grid container spacing={2}>
        {eocGeneral.eoc_specifics.map((eocSpecific) => (
          <Grid item xs={12} md={6} key={eocSpecific.id}>
            <EOCCard eocSpecific={eocSpecific} />
          </Grid>
        ))}
      </Grid>
    </AccordionDetails>
  </Accordion>
);

export default EOCAccordion;
