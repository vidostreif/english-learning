import { $api } from '../api'

export const addTaskRating = async (taskId, rating) => {
  // const formData = new FormData()
  // formData.append('img', img)
  // formData.append('complexity', complexity)
  // formData.append('id', id)
  // formData.append('markers', JSON.stringify(markers))
  // const { data } = await $api.post('api/task', formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data',
  //   },
  // })
  // return data
}

export const fetchTaskRating = async (taskId) => {
  // const { data } = await $api.get(`api/task/${id}`)
  // return data
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
