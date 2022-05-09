import React, { useState, useEffect } from 'react'
import { fetchAllTask } from '../../services/taskService'
import Loader from '../../components/loader/Loader.js'
import TaskCard from '../../components/taskCard/TaskCard'
import styles from './TaskList.module.scss'

const TaskList = (props) => {
  const [taskList, setTaskList] = useState([])

  useEffect(() => {
    getTasksFromServer(1)
  }, [])

  const getTasksFromServer = (page) => {
    fetchAllTask(page).then((data) => {
      setTaskList(data)
    })
  }

  return (
    <div className={styles.TaskList}>
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

export default TaskList
