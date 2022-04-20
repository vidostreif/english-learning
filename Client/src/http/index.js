import axios from 'axios'
import { API_USER_REFRESH } from '../utils/consts'

const $api = axios.create({
  withCredentials: true,
  // credentials: 'include',
  baseURL: process.env.REACT_APP_API_URL,
})

const authInterceptor = (config) => {
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
  return config
}

$api.interceptors.request.use(authInterceptor)

const refreshToken = async () => {
  // const response = await $api.get(
  //   `${process.env.REACT_APP_API_URL}${API_USER_REFRESH}`
  // )
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}${API_USER_REFRESH}`,
    { withCredentials: true, credentials: 'include' }
  )
  localStorage.setItem('token', response.data.accessToken)

  return response
}

//обновление токенов
$api.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    const originalRequest = error.config
    if (
      error.response.status == 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originalRequest._isRetry = true // определяем, что зопрос на обновление токенов уже был
      try {
        await refreshToken()
        return $api.request(originalRequest)
      } catch (error) {
        console.log('Пользователь не авторизован')
      }
    }
    throw error
  }
)

export { $api, refreshToken }
