import Authorization from './pages/Authorization'
import Editor from './pages/editor/Editor'
import Task from './pages/task/Task'
import TaskList from './pages/taskList/TaskList'
import {
  EDITOR_ROUTE,
  TASK_ROUTE,
  TASK_LIST_ROUTE,
  AUTH_ROUTE,
} from './utils/consts'

interface IRouteParam {
  readonly path: string
  readonly Component: React.FC
}

export const authRoutes: Array<IRouteParam> = [
  {
    path: EDITOR_ROUTE,
    Component: Editor,
  },
]

export const publicRoutes: Array<IRouteParam> = [
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
