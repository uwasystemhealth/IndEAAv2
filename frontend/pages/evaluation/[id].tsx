import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../../styles/Home.module.css'

const Evaluation: NextPage = () => {
  return (
    <div className={styles.container}>
      <p>Progress</p>
      <ul>
        <li>
          <Link href='/evaluation/1/'>Overview and EOC</Link>
        </li>
        <li>
          <Link href='/evaluation/1/'>Read Documents</Link>
        </li>
        <li>
          <Link href='/evaluation/1/'>Review Course</Link>
        </li>
        <li>
          <Link href='/evaluation/1/'>Review & Submit</Link>
        </li>
      </ul>

      <p>Documents</p>
      <ul>
        <li>
          Mech5551 Handbook
        </li>
        <li>
          <Link href='/evaluation/1/'>View</Link>
        </li>
        <li>
          <Link href='/evaluation/1/'>Mark as viewed</Link>
        </li>
        <li>
          <Link href='/evaluation/1/'>Add comment</Link>
        </li>
      </ul>

      <p>EOCs</p>
      <ul>
        <li>EOC 1</li>
        <li>EOC 2</li>
        <li>EOC 3</li>
      </ul>

      <Link href='/evaluation/1/'>Next</Link>
    </div>
  )
}

export default Evaluation;
