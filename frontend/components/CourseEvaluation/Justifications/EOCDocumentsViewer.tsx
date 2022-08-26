import React from 'react';
import { Document, EocGeneralEocSpecific, EocSetEocGeneral } from 'utils/api';

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
  return <div>EOCDocumentsViewer</div>;
};

export default EOCDocumentsViewer;
