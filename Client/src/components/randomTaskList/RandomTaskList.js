import React, { useState, useEffect } from 'react'
import { fetchRandomTask } from '../../services/taskService'
import Loader from '../loader/Loader.js'
import TaskCard from '../taskCard/TaskCard'

const RandomTaskList = ({ count, not_id = null }) => {
  const [taskList, setTaskList] = useState([])

  useEffect(() => {
    fetchRandomTask(count, not_id).then((data) => {
      setTaskList(data)
    })
  }, [count, not_id])

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

export default RandomTaskList
