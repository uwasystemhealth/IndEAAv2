import { useState } from 'react';

import type { NextPage } from 'next';

import { Button } from '@mui/material';
import styles from '../styles/Home.module.css';

import BodyCard from '../components/utils/BodyCard';

import OngoingReviewsList from '../components/Reviewer/OngoingReviewsList';

const Reviewer: NextPage = () => {
  const [showArchived, setShowArchived] = useState(false);
  const archivedButtonText = showArchived ? 'Hide Archived' : 'Show Archvied';
  const toggleArchived = () => setShowArchived(!showArchived);

  return (
    <div className={styles.container}>
      <BodyCard header="Review Courses">
        <div>
          <Button onClick={toggleArchived}>{archivedButtonText}</Button>
          <OngoingReviewsList showArchived={showArchived} />
        </div>
      </BodyCard>
    </div>
  );
};

export default Reviewer;
