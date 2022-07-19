import { useState } from 'react'

import type { NextPage } from 'next'

import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

import BodyCard from '../components/utils/BodyCard'

import { Card, Button } from '@mui/material';

const Reviewer: NextPage = () => {

  const showArchived = useState(false);

  return (
    <div className={styles.container}>
      <BodyCard header="Review Courses">
        <div>
          <Button>Archived</Button>
          <OngoingReviewsList showArchived={showArchived} />
        </div>
      </BodyCard>
    </div>
  )
}

export default Reviewer;
