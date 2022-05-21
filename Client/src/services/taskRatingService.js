import { $api } from '../api'
import { API_TASK_RATING } from '../utils/consts'

export const addTaskRating = async (taskId, rating) => {
  const { data } = await $api.post(API_TASK_RATING, {
    taskId,
    rating,
  })
  return data
}

export const fetchTaskRating = async (taskId) => {
  const { data } = await $api.get(`${API_TASK_RATING}/${taskId}`)
  return data
}

export const fetchAllTaskRating = async (page) => {
  // const { data } = await $api.get(`api/task/`, {
  //   params: {
  //     page,
  //   },
  // })
  // return data
}

export const removeTaskRating = async (taskId) => {
  // const { data } = await $api.get(`api/task/random`, {
  //   params: {
  //     not_id,
  //   },
  // })
  // return data
}
