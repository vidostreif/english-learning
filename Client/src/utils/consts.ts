const API: string = '/api'

export const TASK_ROUTE: string = '/tasks'
export const TASK_LIST_ROUTE: string = '/task_list'
export const TASK_RATING: string = '/tasks_ratings'
export const EDITOR_ROUTE: string = '/editor'
export const AUTH_ROUTE: string = '/authorization'
export const USER: string = '/users'

export const API_TASK: string = `${API}${TASK_ROUTE}`
export const API_TASK_PASSED: string = `${API}${TASK_ROUTE}/passed`
export const API_TASK_RANDOM: string = `${API}${TASK_ROUTE}/random`

export const API_TASK_RATING: string = `${API}${TASK_RATING}`
export const API_TASK_RATING_YOUR: string = `${API}${TASK_RATING}/your`

export const API_USERS: string = `${API}${USER}`
export const API_USER_LOGIN: string = `${API}${USER}/login`
// export const API_USER_REGISTRATION: string = `${API}${USER}/registration`
export const API_USER_LOGOUT: string = `${API}${USER}/logout`
export const API_USER_REFRESH: string = `${API}${USER}/refresh`
// export const API_USER_USERS: string = `${API}${USER}/users`
