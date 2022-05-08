import { $api } from '../api'

export const addTaskRating = async (taskId, rating) => {
  const { data } = await $api.post('api/task_rating', {
    taskId,
    rating,
  })
  return data
}

export const fetchTaskRating = async (taskId) => {
  const { data } = await $api.get(`api/task_rating/${taskId}`)
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
