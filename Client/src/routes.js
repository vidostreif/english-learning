import Authorization from './pages/Authorization'
import Editor from './pages/Editor'
import Task from './pages/task/Task'
import TaskList from './pages/taskList/TaskList'
import {
  EDITOR_ROUTE,
  TASK_ROUTE,
  TASK_LIST_ROUTE,
  AUTH_ROUTE,
} from './utils/consts'

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
  {
    path: AUTH_ROUTE,
    Component: Authorization,
  },
]
