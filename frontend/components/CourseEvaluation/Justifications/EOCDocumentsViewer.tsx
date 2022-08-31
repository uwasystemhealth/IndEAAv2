import React from 'react';
import { Document, EocGeneralEocSpecific, EocSetEocGeneral } from 'utils/api';
import Stack from '@mui/material/Stack';
import TabPanel, { a11yProps } from '@/components/Custom/TabPanel';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DocumentCard from '../Documents/DocumentCard';

type Props = {
  documents: Document[];

  // These are used to filter the documents being processed.
  eocGeneralToFilter: EocSetEocGeneral;
  eocSpecificToFilter: EocGeneralEocSpecific;
};

/**
 *
 * This component handles the logic to display the documents depending on whether "General" or "Specific" Documents are wanted
 */
const EOCDocumentsViewer = (props: Props) => {
  const { documents, eocGeneralToFilter, eocSpecificToFilter } = props;
  const documentsMatchingEOCGeneral = documents.filter((document) =>
    document.eoc_generals.map((obj) => obj.id).includes(eocGeneralToFilter.id),
  );
  const documentsMatchingEOCSpecific = documents.filter((document) =>
    document.eoc_specifics.map((obj) => obj.id).includes(eocSpecificToFilter.id),
  );

  const [tabsValue, setTabsValue] = React.useState(0);
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };

  return (
    <div>
      <Tabs value={tabsValue} onChange={handleChangeTab} variant="fullWidth">
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Tab label="General Documents" {...a11yProps(0)} />
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Tab label="Specific Documents" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={tabsValue} index={0}>
        <Stack spacing={2}>
          {documentsMatchingEOCGeneral.map((document) => (
            <DocumentCard key={document.id} document={document} isReadOnly={false} />
          ))}
        </Stack>
      </TabPanel>
      <TabPanel value={tabsValue} index={1}>
        <Stack spacing={2}>
          {documentsMatchingEOCSpecific.map((document) => (
            <DocumentCard key={document.id} document={document} isReadOnly={false} />
          ))}
        </Stack>
      </TabPanel>
    </div>
  );
};

export default EOCDocumentsViewer;
