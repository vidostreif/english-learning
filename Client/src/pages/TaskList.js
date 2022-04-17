import React, { useState, useEffect } from 'react'
import '../App.css'
import { fetchAllTask } from '../http/taskAPI'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader/Loader.js'

const TaskList = (props) => {
  // const history = useLocation()
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
        taskList.map((element) => {
          return (
            <Link to={`/task?id=${element.id}`} key={element.id}>
              <img
                className="TaskListElement"
                src={process.env.REACT_APP_API_URL + element.imgUrl}
                alt="1"
              />
            </Link>
          )
        })
      ) : (
        <Loader />
      )}
    </div>
  )
}

export default TaskList
