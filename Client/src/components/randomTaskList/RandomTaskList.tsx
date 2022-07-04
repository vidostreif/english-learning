import React, { useState, useEffect } from 'react'
import { useFetching } from '../../hooks/useFetching'
import { fetchRandomTask } from '../../services/taskService'
import Loader from '../loader/Loader'
import TaskCard from '../taskCard/TaskCard'
import styles from './RandomTaskList.module.scss'

interface IProps {
  readonly count: number // количество заданий
  readonly not_id: number | null // кроме задания с этим id
}

// список заданий который запрашивает рандомные задания
const RandomTaskList: React.FC<IProps> = ({ count, not_id = null }) => {
  const [taskList, setTaskList] = useState<Array<ITaskFromServer>>([])
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
