import { $api } from '../api'
import { API_TASK, API_TASK_PASSED, API_TASK_RANDOM } from '../utils/consts'

export const createTask = async (img, markers, complexity, id = null) => {
  const formData = new FormData()
  formData.append('img', img)
  formData.append('complexity', complexity)
  formData.append('id', id)
  formData.append('markers', JSON.stringify(markers))

  const { data } = await $api.post(API_TASK, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const fetchTask = async (id) => {
  console.log(await $api.post(`${API_TASK_PASSED}/${id}`))

  const { data } = await $api.get(`${API_TASK}/${id}`)
  return data
}

export const fetchAllTask = async (page, limit, sort) => {
  const { data } = await $api.get(API_TASK, {
    params: {
      page,
      limit,
      sort,
    },
  })
  return data
}

export const fetchRandomTask = async (count, not_id = null) => {
  const { data } = await $api.get(API_TASK_RANDOM, {
    params: {
      not_id,
      count,
    },
  })
  return data
}

// увеличение счетчика прохождения задания
export const setTaskPassed = async (id) => {
  await $api.post(`${API_TASK_PASSED}/${id}`)
}
