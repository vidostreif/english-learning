import { $api } from '../api'
import { API_TASK, API_TASK_PASSED, API_TASK_RANDOM } from '../utils/consts'

// сохранение задания
export const createTask = async (
  img: File | null,
  markers: Array<IMarker>,
  complexity: number,
  id: number | null = null
) => {
  const formData = new FormData()
  if (img) formData.append('img', img)
  formData.append('complexity', JSON.stringify(complexity))
  if (id) formData.append('id', JSON.stringify(id))
  formData.append('markers', JSON.stringify(markers))

  const { data } = await $api.post(API_TASK, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

// получение задания
export const fetchTask = async (id: number) => {
  const { data } = await $api.get(`${API_TASK}/${id}`)
  return data
}

// получение списка заданий
export const fetchAllTask = async (
  page: number,
  limit: number,
  sort: number
) => {
  const { data } = await $api.get(API_TASK, {
    params: {
      page,
      limit,
      sort,
    },
  })
  return data
}

// получение рандомного списка заданий
export const fetchRandomTask = async (
  count: number,
  not_id: number | null = null
) => {
  const { data } = await $api.get(API_TASK_RANDOM, {
    params: {
      not_id,
      count,
    },
  })
  return data
}

// увеличение счетчика прохождения задания
export const setTaskPassed = async (id: number) => {
  await $api.post(`${API_TASK_PASSED}/${id}`)
}
