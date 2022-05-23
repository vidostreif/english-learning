export const TASK_ROUTE = '/task'
export const TASK_LIST_ROUTE = '/task_list'
export const TASK_RATING = '/task_rating'
export const EDITOR_ROUTE = '/editor'
export const AUTH_ROUTE = '/authorization'
export const USER = '/user'

const API = '/api'

export const API_TASK = `${API}${TASK_ROUTE}`
export const API_TASK_PASSED = `${API}${TASK_ROUTE}/passed`
export const API_TASK_RANDOM = `${API}${TASK_ROUTE}/random`

export const API_TASK_RATING = `${API}${TASK_RATING}`

export const API_USER_LOGIN = `${API}${USER}/login`
export const API_USER_REGISTRATION = `${API}${USER}/registration`
export const API_USER_LOGOUT = `${API}${USER}/logout`
export const API_USER_REFRESH = `${API}${USER}/refresh`
export const API_USER_USERS = `${API}${USER}/users`
