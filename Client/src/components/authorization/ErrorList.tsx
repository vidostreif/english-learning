import React from 'react'
import styles from './ErrorList.module.scss'

interface IProps {
  list: Array<string>
}

const ErrorList: React.FC<IProps> = ({ list }) => {
  if (list.length === 0) {
    return <ul className={styles.ul}></ul>
  } else {
    return (
      <ul className={styles.ul}>
        {list.map((item, i) => (
          <li className={styles.ul__li} key={i}>
            {item}
          </li>
        ))}
      </ul>
    )
  }
}

export default ErrorList
