import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const Admin: NextPage = () => {
  return (
    <div className={styles.container}>
      Admin page
      <ul>
        <li>
          <Link href='/'>IndEAA</Link>
        </li>
        <li>
          <Link href='/'>Sign out</Link>
        </li>
        <li>
          <Link href='/admin'>Administrator</Link>
        </li>
        <li>
          <Link href='/coordinator'>Coordinator</Link>
        </li>
        <li>
          <Link href='/reviewer'>Reviewer</Link>
        </li>
      </ul>
    </div>
  )
}

export default Admin;
