import React, { useState, useEffect } from 'react'
import { useFetching } from '../../hooks/useFetching'
import { fetchRandomTask } from '../../services/taskService'
import Loader from '../loader/Loader.js'
import TaskCard from '../taskCard/TaskCard'
import styles from './RandomTaskList.module.scss'

// список заданий который запрашивает рандомные задания
// count - количество заданий
// not_id - кроме задания с этим id
const RandomTaskList = ({ count, not_id = null }) => {
  const [taskList, setTaskList] = useState([])
  const { loading, fetching } = useFetching() // обертка для отображения состояния загрузки данных с сервера

  useEffect(() => {
    fetching(async () => {
      await fetchRandomTask(count, not_id).then((data) => {
        setTaskList(data)
      })
    })
  }, [count, not_id, fetching])

  return (
    <div className={styles.RandomTaskList}>
      {!loading ? (
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
