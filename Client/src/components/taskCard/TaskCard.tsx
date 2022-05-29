import React from 'react'
import { Link } from 'react-router-dom'
import FiveStars from '../fiveStars/FiveStars'
import DifficultyDisplay from '../difficultyDisplay/DifficultyDisplay'
import { TASK_ROUTE } from '../../utils/consts'

// type TPTask = {
//   readonly id: string
//   readonly rating: number
//   readonly complexity: number
//   readonly imgUrl: string
// }

// type TPStyles = {
//   readonly [key: string]: string
// }

type TitleProps = {
  readonly task: Task
  readonly rootStyles: StylesModule
}

// карточка задания для списка заданий
const TaskCard: React.FC<TitleProps> = ({ task, rootStyles }) => {
  return (
    <Link
      to={`${TASK_ROUTE}?id=${task.id}`}
      key={task.id}
      className={rootStyles?.TaskListElement || 'TaskListElement'}
    >
      <div
        className={
          rootStyles?.TaskListElement__imgConteiner ||
          'TaskListElement__imgConteiner'
        }
      >
        <img
          className={rootStyles?.TaskListElement__img || 'TaskListElement__img'}
          src={`${process.env.REACT_APP_API_URL}/mini_${task.imgUrl}`}
          alt="1"
        />
      </div>
      <div
        className={
          rootStyles?.TaskListElement__fiveStars || 'TaskListElement__fiveStars'
        }
      >
        <FiveStars
          showRatingValue={false}
          active={false}
          incomingRatingValue={task.rating}
        />
        <DifficultyDisplay complexity={task.complexity} />
      </div>
    </Link>
  )
}

export default TaskCard
