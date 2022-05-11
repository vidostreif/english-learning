import React from 'react'
import styles from './DifficultyDisplay.module.scss'

// отображение сложности задания
const DifficultyDisplay = ({ complexity = 0 }) => {
  return (
    <div className={styles.container}>
      <div
        className={
          complexity > 0
            ? `${styles.container__active1} ${styles.container__line1}`
            : styles.container__line1
        }
      ></div>
      <div
        className={
          complexity > 1
            ? `${styles.container__active2} ${styles.container__line2}`
            : styles.container__line2
        }
      ></div>
      <div
        className={
          complexity > 2
            ? `${styles.container__active3} ${styles.container__line3}`
            : styles.container__line3
        }
      ></div>
      <div
        className={
          complexity > 3
            ? `${styles.container__active4} ${styles.container__line4}`
            : styles.container__line4
        }
      ></div>
      <div
        className={
          complexity > 4
            ? `${styles.container__active5} ${styles.container__line5}`
            : styles.container__line5
        }
      ></div>
    </div>
  )
}

export default DifficultyDisplay
