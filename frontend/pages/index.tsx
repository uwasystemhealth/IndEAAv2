import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const Index: NextPage = () => {
  return (
    <div className={styles.container}>
      <ul>
        <li>
          <Link href='/'>Indeaa</Link>
        </li>
        <li>
          <Link href='/onboarding'>Login with Google</Link>
        </li>
      </ul>
    </div>
  )
}

export default Index;
