import React, { useState, useEffect } from 'react'
import { fetchAllTask } from '../../services/taskService'
import Loader from '../../components/loader/Loader.js'
import TaskCard from '../../components/taskCard/TaskCard'
import styles from './TaskList.module.scss'
import VSelect from '../../components/ui/VSelect/VSelect'

const TaskList = (props) => {
  const [taskList, setTaskList] = useState([])
  const [selectedSort, setSelectedSort] = useState('')

  useEffect(() => {
    getTasksFromServer(1, selectedSort)
  }, [selectedSort])

  const getTasksFromServer = (page, sort) => {
    fetchAllTask(page, sort).then((data) => {
      setTaskList(data)
    })
  }

  // const sortTasks = (sort) => {
  //   setSelectedSort(sort)
  // }

  return (
    <div className={styles.container}>
      <div>
        <VSelect
          value={selectedSort}
          onChange={(sort) => setSelectedSort(sort)}
          defaultValue="Сортировка"
          options={[
            { value: 'newFirst', name: 'Сначала новые' },
            { value: 'popularFirst', name: 'Сначала популярные' },
            { value: 'hardFirst', name: 'Cначала сложные' },
            { value: 'easyFirst', name: 'Сначала простые' },
            {
              value: 'highlyRatedFirst',
              name: 'Сначала с высоким рейтингом',
            },
            { value: 'lowRatedFirst', name: 'Сначала с низким рейтингом' },
          ]}
        />
      </div>
      <div className={styles.TaskList}>
        {taskList.length > 0 ? (
          taskList.map((element, i) => {
            return <TaskCard task={element} rootStyles={styles} key={i} />
          })
        ) : (
          <Loader />
        )}
      </div>
    </div>
  )
}

export default TaskList
