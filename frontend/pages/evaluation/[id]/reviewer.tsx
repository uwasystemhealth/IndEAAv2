import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../../styles/Home.module.css'

const Evaluation: NextPage = () => {
  return (
    <div className={styles.container}>
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

      <p>Progress</p>
      <ul>
        <li>
          <Link href='/evaluation/1/reviewer'>Overview and EOC</Link>
        </li>
        <li>
          <Link href='/evaluation/1/reviewer'>Read Documents</Link>
        </li>
        <li>
          <Link href='/evaluation/1/reviewer'>Review Course</Link>
        </li>
        <li>
          <Link href='/evaluation/1/reviewer'>Review & Submit</Link>
        </li>
      </ul>

      <p>Documents</p>
      <ul>
        <li>
          Mech5551 Handbook
        </li>
        <li>
          <Link href='/evaluation/1/reviewer'>View</Link>
        </li>
        <li>
          <Link href='/evaluation/1/reviewer'>Mark as viewed</Link>
        </li>
        <li>
          <Link href='/evaluation/1/reviewer'>Add comment</Link>
        </li>
      </ul>

      <p>EOCs</p>
      <ul>
        <li>EOC 1</li>
        <li>EOC 2</li>
        <li>EOC 3</li>
      </ul>

      <Link href='/evaluation/1/reviewer'>Next</Link>
    </div>
  )
}

export default Evaluation;
