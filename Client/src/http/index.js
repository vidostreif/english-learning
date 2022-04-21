import axios from 'axios'
import { API_USER_REFRESH } from '../utils/consts'

const $api = axios.create({
  withCredentials: true,
  // credentials: 'include',
  baseURL: process.env.REACT_APP_API_URL,
})

const authInterceptor = async (config) => {
  //проверям, время жизни токена, если он есть
  //если время жизни (-10 секунд) прошло, то запрашиваем новый токен
  const token = localStorage.getItem('token')
  const tokenDeathTime = localStorage.getItem('tokenDeathTime')
  if (token && tokenDeathTime && +new Date() > tokenDeathTime - 10000) {
    await apiRefreshToken()
  }
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
  return config
}
//подстановка токена авторизации в запрос
$api.interceptors.request.use(authInterceptor)

//обновление токена
const apiRefreshToken = async () => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}${API_USER_REFRESH}`,
      { withCredentials: true, credentials: 'include' }
    )
    console.log('рефреш токена')
    localStorage.setItem('token', response.data.accessToken)
    localStorage.setItem(
      'tokenDeathTime',
      +new Date() + response.data.lifetimeAccessToken * 1000
    )
    return response
  } catch (error) {
    localStorage.removeItem('token')
    localStorage.removeItem('tokenDeathTime')
    console.log('Пользователь не авторизован')
    return null
  }
}

//обновление токенов при ошибке авторизации
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

      if (await apiRefreshToken()) {
        return $api.request(originalRequest)
      }
    }
    throw error
  }
)

export { $api, apiRefreshToken }
