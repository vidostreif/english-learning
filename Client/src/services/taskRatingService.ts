import { $api } from '../api'
import { API_TASK_RATING_YOUR } from '../utils/consts'

// работа с оценками пользователя
export const addTaskRating = async (taskId: number, rating: number): Promise<ITaskRating> => {
  const { data } = await $api.post(API_TASK_RATING_YOUR, {
    taskId,
    rating,
  })
  return data
}

export const fetchTaskRating = async (taskId: number): Promise<ITaskRating> => {
  const { data } = await $api.get(`${API_TASK_RATING_YOUR}/${taskId}`)
  return data
}

export const fetchAllTaskRating = async (page: number): Promise<Array<ITaskRating>> => {
  const { data } = await $api.get(API_TASK_RATING_YOUR, {
    params: {
      page,
    },
  })
  return data
}

export const removeTaskRating = async (taskId: number): Promise<string> => {
  const { data } = await $api.delete(`${API_TASK_RATING_YOUR}/${taskId}`)
  return data
}
