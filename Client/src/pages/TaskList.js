import React, { useState, useEffect } from 'react'
import { fetchAllTask } from '../services/taskService'
import Loader from '../components/loader/Loader.js'
import TaskCard from '../components/taskCard/TaskCard'

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
    <div className="TaskList">
      {taskList.length > 0 ? (
        taskList.map((element, i) => {
          return <TaskCard task={element} key={i} />
        })
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default TaskList
