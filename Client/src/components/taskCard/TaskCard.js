import React from 'react'
import { Link } from 'react-router-dom'
import FiveStars from '../fiveStars/FiveStars'
import DifficultyDisplay from '../difficultyDisplay/DifficultyDisplay'

const TaskCard = ({ task, rootStyles }) => {
  return (
    <Link
      to={`/task?id=${task.id}`}
      key={task.id}
      className={rootStyles?.TaskListElement || 'TaskListElement'}
    >
      <img
        className={rootStyles?.TaskListElement__img || 'TaskListElement__img'}
        src={`${process.env.REACT_APP_API_URL}/${task.imgUrl}`}
        alt="1"
      />
      <div
        className={
          rootStyles?.TaskListElement__fiveStars || 'TaskListElement__fiveStars'
        }
      >
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
