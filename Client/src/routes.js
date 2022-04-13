import Editor from './pages/Editor'
import Task from './pages/Task'
import TaskList from './pages/TaskList'
import { EDITOR_ROUTE, TASK_ROUTE, TASK_LIST_ROUTE } from './utils/consts'

export const authRoutes = [
  {
    path: EDITOR_ROUTE,
    Component: Editor,
  },
]

export const publicRoutes = [
  {
    path: TASK_ROUTE,
    Component: Task,
  },
  {
    path: TASK_LIST_ROUTE,
    Component: TaskList,
  },
]
