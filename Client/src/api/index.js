import axios from 'axios'
import { API_USER_REFRESH } from '../utils/consts'
import toast from 'react-hot-toast'
import EventService from '../services/eventService'

const $api = axios.create({
  withCredentials: true,
  // credentials: 'include',
  baseURL: process.env.REACT_APP_API_URL,
})

let refreshTokenIsUpdating = false

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

//перехват запроса на сервер
const authInterceptor = async (config) => {
  //проверям, время жизни токена, если он есть
  //если время жизни (-10 секунд) прошло, то запрашиваем новый токен
  const token = localStorage.getItem('token')
  const tokenDeathTime = localStorage.getItem('tokenDeathTime')

  //если токен устарел и он сейчас не обновляется, то запрашиваем новый токен
  if (token && tokenDeathTime && +new Date() > tokenDeathTime - 10000) {
    await apiRefreshToken()
  }

  //если токен сейчас обновляется, то ожидаем завершения обновления
  while (refreshTokenIsUpdating) {
    await sleep(100)
  }

  //подстовляем в запрос токен авторизации
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
  return config
}
//подстановка токена авторизации в запрос
$api.interceptors.request.use(authInterceptor)

//запрос на обновление токена
const apiRefreshToken = async () => {
  if (refreshTokenIsUpdating) return
  refreshTokenIsUpdating = true
  let response = null
  try {
    response = await axios.get(
      `${process.env.REACT_APP_API_URL}${API_USER_REFRESH}`,
      { withCredentials: true, credentials: 'include' }
    )
    localStorage.setItem('token', response.data.accessToken)
    localStorage.setItem(
      'tokenDeathTime',
      +new Date() + response.data.lifetimeAccessToken * 1000
    )
  } catch (error) {
    // localStorage.removeItem('token')
    // localStorage.removeItem('tokenDeathTime')
    EventService.emit('logout')
    toast.error('Ошибка авторизации!')
    response = null
  }

  refreshTokenIsUpdating = false
  return response
}

//обновление токенов при перехвате ответа
$api.interceptors.response.use(
  (config) => {
    if (config.data?.accessToken) {
      // console.log(config.data?.accessToken)
      localStorage.setItem('token', config.data.accessToken)
      localStorage.setItem(
        'tokenDeathTime',
        +new Date() + config.data.lifetimeAccessToken * 1000
      )
    }
    return config
  },
  async (error) => {
    const originalRequest = error.config
    if (
      error.response?.status === 401 &&
      error.config &&
      !error.config?._isRetry
    ) {
      originalRequest._isRetry = true // определяем, что зопрос на обновление токенов уже был

      await apiRefreshToken()

      //если токен сейчас обновляется, то ожидаем завершения обновления
      while (refreshTokenIsUpdating) {
        await sleep(100)
      }

      return $api.request(originalRequest)
    }
    throw error
  }
)

export { $api, apiRefreshToken }
