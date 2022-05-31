import React from 'react'
import styles from './Loader.module.scss'

// отображение загрузки
const Loader: React.FC = () => {
  return (
    <>
      <div className={styles.loader__container}>
        <div className={`${styles.loader__ball} ${styles.loader__yellow}`}></div>
        <div className={`${styles.loader__ball} ${styles.loader__red}`}></div>
        <div className={`${styles.loader__ball} ${styles.loader__blue}`}></div>
        <div className={`${styles.loader__ball} ${styles.loader__violet}`}></div>
      </div>
    </>
  )
}

export default Loader
