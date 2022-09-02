import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import React from 'react';
import { EocGeneralEocSpecific, EocSetEocGeneral, ReviewListEntry } from 'utils/api';
import EOCCard from './EOCCard';

type Props = {
  eocGeneral: EocSetEocGeneral;
  handleSelectEOCSpecificAndGeneral: (
    eocGeneral: EocSetEocGeneral,
  ) => (eocSpecific: EocGeneralEocSpecific) => void;

  // This is useful for Reviewer
  review?: ReviewListEntry;
};

const EOCAccordion = ({ eocGeneral, handleSelectEOCSpecificAndGeneral, review }: Props) => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>{`EOC ${eocGeneral.number}: ${eocGeneral.title}`}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Grid container spacing={2}>
        {eocGeneral.eoc_specifics.map((eocSpecific) => (
          <Grid item xs={12} md={6} key={eocSpecific.id}>
            <EOCCard
              eocSpecific={eocSpecific}
              handleSelectEOCSpecific={handleSelectEOCSpecificAndGeneral(eocGeneral)}
              review={review}
            />
          </Grid>
        ))}
      </Grid>
    </AccordionDetails>
  </Accordion>
);

EOCAccordion.defaultProps = {
  review: undefined,
};

export default EOCAccordion;
