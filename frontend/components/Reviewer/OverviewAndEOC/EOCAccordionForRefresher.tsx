import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import React, { useState } from 'react';
import { EocGeneralEocSpecific, EocSetEocGeneral } from 'utils/api';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

type Props = {
  eocGeneral: EocSetEocGeneral;
};

const EOCAccordionForRefresher = ({ eocGeneral }: Props) => {
  const [value, setValue] = useState('0');
  const handleChange = (event: React.SyntheticEvent, newValue: React.SetStateAction<string>) => {
    setValue(newValue);
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{`EOC ${eocGeneral.number}: ${eocGeneral.title}`}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <TabContext value={`${value}`}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange}>
              {eocGeneral.eoc_specifics.map((eocSpecific, index) => (
                <Tab
                  key={eocSpecific.id}
                  value={`${index}`}
                  label={`EOC ${eocSpecific.general_and_specific_eoc}`}
                />
              ))}
            </TabList>
          </Box>
          {eocGeneral.eoc_specifics.map((eocSpecific, index) => (
            <TabPanel key={eocSpecific.id} value={`${index}`}>
              <Typography gutterBottom>
                <strong>Description:</strong> {eocSpecific.description}
              </Typography>
              <Typography>
                <strong>Indicators of Attainment:</strong>
              </Typography>
              <List>
                {eocSpecific.indicators_of_attainment.map((indicator, indicatorIndex) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <ListItem key={indicatorIndex} sx={{ display: 'list-item' }}>
                    {indicator}
                  </ListItem>
                ))}
              </List>
            </TabPanel>
          ))}
        </TabContext>
      </AccordionDetails>
    </Accordion>
  );
};

export default EOCAccordionForRefresher;
