import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

const Coordinator: NextPage = () => {
  return (
    <div className={styles.container}>
      Coordinator Page
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


        <li>
          <ul>
            MECH5551/MECH5552 Evaluation

            <li>
              <Link href='/evaluation/1/coordinator'>View</Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  )
}

export default Coordinator;
