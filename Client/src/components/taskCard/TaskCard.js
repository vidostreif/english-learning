import React from 'react'
import { Link } from 'react-router-dom'
import FiveStars from '../fiveStars/FiveStars'
import DifficultyDisplay from '../difficultyDisplay/DifficultyDisplay'

const TaskCard = ({ task }) => {
  return (
    <Link to={`/task?id=${task.id}`} key={task.id} className="TaskListElement">
      <img
        className="TaskListElement__img"
        src={`${process.env.REACT_APP_API_URL}/${task.imgUrl}`}
        alt="1"
      />
      <div className="TaskList__fiveStars">
        <FiveStars
          showRatingValue={false}
          active={false}
          incomingRatingValue={10}
        />
        <DifficultyDisplay complexity={task.complexity} />
      </div>
    </Link>
  )
}

export default TaskCard
