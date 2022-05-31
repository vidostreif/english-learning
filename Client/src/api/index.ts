import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_USER_REFRESH } from '../utils/consts'
import toast from 'react-hot-toast'
import EventService from '../services/eventService'

interface IToken {
  accessToken: string // ключ доступа
  lifetimeAccessToken: string // время жизни ключа
}

interface ICustomAxiosRequestConfig extends AxiosRequestConfig {
  _isRetry?: boolean // признак, что запрос повторный
}

interface ICustomAxiosError extends AxiosError {
  config: ICustomAxiosRequestConfig
}

const $api: AxiosInstance = axios.create({
  withCredentials: true,
  // credentials: 'include',
  baseURL: process.env.REACT_APP_API_URL,
})

let refreshTokenIsUpdating: boolean = false

function sleep(ms: number): Promise<Function> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

//перехват запроса на сервер
const authInterceptor = async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
  //проверям, время жизни токена, если он есть
  //если время жизни (-10 секунд) прошло, то запрашиваем новый токен
  const token: string | null = localStorage.getItem('token')
  const tokenDeathTime: string | null = localStorage.getItem('tokenDeathTime')

  //если токен устарел и он сейчас не обновляется, то запрашиваем новый токен
  if (token && tokenDeathTime && +new Date() > +tokenDeathTime - 10000) {
    await apiRefreshToken()
  }

  //если токен сейчас обновляется, то ожидаем завершения обновления
  while (refreshTokenIsUpdating) {
    await sleep(100)
  }

  //подстовляем в запрос токен авторизации
  if (!config.headers) {
    config.headers = {}
  }
  // config.headers =config.headers ? {...config.headers} : {}
  config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
  return config
}
//подстановка токена авторизации в запрос
$api.interceptors.request.use(authInterceptor)

//запрос на обновление токена
const apiRefreshToken = async () => {
  if (refreshTokenIsUpdating) return
  refreshTokenIsUpdating = true
  let response: AxiosResponse | null = null
  try {
    // , credentials: 'include'
    response = await axios.get(`${process.env.REACT_APP_API_URL}${API_USER_REFRESH}`, { withCredentials: true })
    if (response) {
      const data: IToken = response.data
      if (data.accessToken && data.lifetimeAccessToken) {
        localStorage.setItem('token', data.accessToken)
        localStorage.setItem('tokenDeathTime', (+new Date() + Number(data.lifetimeAccessToken) * 1000).toString())
      } else {
        throw new Error('Не нашли токен в ответе')
      }
    }
  } catch (error) {
    EventService.emit('logout')

    if (axios.isAxiosError(error)) {
      // если ошибка от axios то берем данные из response
      toast.error((error.response?.data as IErrorMessage).message)
    } else if (error instanceof Error) {
      // если типовая ошибка, то просто выводим сообщение
      toast.error(error.message)
    } else {
      // если не определили, то пробрасываем дальше
      throw error
    }

    response = null
  }

  refreshTokenIsUpdating = false
  return response
}

//обновление токенов при перехвате ответа
$api.interceptors.response.use(
  (config) => {
    if (config.data?.accessToken) {
      const data: IToken = config.data
      localStorage.setItem('token', data.accessToken)
      localStorage.setItem('tokenDeathTime', (+new Date() + Number(data.lifetimeAccessToken) * 1000).toString())
    }
    return config
  },
  async (error: ICustomAxiosError) => {
    const originalRequest: ICustomAxiosRequestConfig = error.config
    if (error.response?.status === 401 && error.config && !error.config._isRetry) {
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
