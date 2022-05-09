import React, { useState, useEffect } from 'react'
import { fetchRandomTask } from '../../services/taskService'
import Loader from '../loader/Loader.js'
import TaskCard from '../taskCard/TaskCard'
import styles from './RandomTaskList.module.scss'

const RandomTaskList = ({ count, not_id = null }) => {
  const [taskList, setTaskList] = useState([])

  useEffect(() => {
    fetchRandomTask(count, not_id).then((data) => {
      setTaskList(data)
    })
  }, [count, not_id])

  return (
    <div className={styles.RandomTaskList}>
      {taskList.length > 0 ? (
        taskList.map((element, i) => {
          return <TaskCard task={element} rootStyles={styles} key={i} />
        })
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default RandomTaskList
