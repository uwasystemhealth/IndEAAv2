import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

import BodyCard from '../components/utils/BodyCard'

import { Card } from '@mui/material';

const Reviewer: NextPage = () => {
  return (
    <div className={styles.container}>
      <BodyCard>
        <div>
          swag
        </div>
      </BodyCard>
    </div>
  )
}

export default Reviewer;
