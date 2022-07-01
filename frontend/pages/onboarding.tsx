import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const Page: NextPage = () => {
  return (
    <div className={styles.container}>
      <Link href='/'>IndEAA</Link>
      <Link href='/'>Sign out</Link>
      <Link href='/administrator'>Administrator</Link>
      <Link href='/coordinator'>Coordinator</Link>
      <Link href='/reviewer'>Reviewer</Link>
    </div>
  )
}

export default Page;
