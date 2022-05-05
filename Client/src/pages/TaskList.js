import React, { useState, useEffect } from 'react'
import '../App.css'
import { fetchAllTask } from '../http/taskAPI'
import { Link } from 'react-router-dom'
import Loader from '../components/loader/Loader.js'
import FiveStars from '../components/fiveStars/FiveStars'
import DifficultyDisplay from '../components/difficultyDisplay/DifficultyDisplay'

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
        taskList.map((element, i) => {
          return (
            <Link
              to={`/task?id=${element.id}`}
              key={element.id}
              className="TaskListElement"
            >
              <div className="TaskListElement__div">
                <img
                  className="TaskListElement__img"
                  src={`${process.env.REACT_APP_API_URL}/${element.imgUrl}`}
                  alt="1"
                />
                <div className="TaskList__fiveStars">
                  <FiveStars active={false} incomingRatingValue={10 * i} />
                  <DifficultyDisplay complexity={element.complexity} />
                </div>
              </div>
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
