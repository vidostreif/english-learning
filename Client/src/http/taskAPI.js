import { $api } from './index'

export const createTask = async (img, markers, id = null) => {
  const formData = new FormData()
  formData.append('img', img)
  formData.append('id', id)
  formData.append('markers', JSON.stringify(markers))

  const { data } = await $api.post('api/task', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export const fetchTask = async (id) => {
  const { data } = await $api.get(`api/task/${id}`)
  return data
}

export const fetchAllTask = async (page) => {
  const { data } = await $api.get(`api/task/`, {
    params: {
      page,
    },
  })
  return data
}

export const fetchRandomTask = async (not_id = null) => {
  const { data } = await $api.get(`api/task/random`, {
    params: {
      not_id,
    },
  })
  return data
}
