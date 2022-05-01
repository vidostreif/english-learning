import { makeAutoObservable } from 'mobx'
import AuthService from '../services/AuthService'
import toast from 'react-hot-toast'

export default class Store {
  user = {}
  isAuth = false
  isAuthLoading = false

  constructor() {
    makeAutoObservable(this)
  }

  setAuth(bool) {
    this.isAuth = bool
  }

  setUser(user) {
    this.user = user
  }

  setAuthLoading(bool) {
    this.isAuthLoading = bool
  }

  async login(email, password) {
    try {
      const response = await AuthService.login(email, password)
      toast(`И снова привет ${response.data.user.email}`, {
        icon: '🖐',
      })
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  async registration(email, password) {
    try {
      const response = await AuthService.registration(email, password)
      toast(`Вы успешно зарегестрированы ${response.data.user.email}`, {
        icon: '🎉',
      })
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  async logout() {
    try {
      await AuthService.logout()
      toast(`Досвидания!`, {
        icon: '👋',
      })
      localStorage.removeItem('token')
      localStorage.removeItem('tokenDeathTime')
      this.setAuth(false)
      this.setUser({})
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
  }

  //если в стороке есть токен, то проверяем его валидность
  async checkAuth() {
    this.setAuthLoading(true)

    if (localStorage.getItem('token')) {
      const response = await AuthService.refreshToken()
      if (response) {
        this.setAuth(true)
        this.setUser(response.data.user)
      } else {
        this.setAuth(false)
        this.setUser({})
      }
    }

    this.setAuthLoading(false)
  }
}
