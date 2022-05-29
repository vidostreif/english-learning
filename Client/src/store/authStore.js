import { makeAutoObservable } from 'mobx'
import AuthService from '../services/authService'
import toast from 'react-hot-toast'
import EventService from '../services/eventService'

export default class AuthStore {
  user = {}
  isAuth = false
  isAuthLoading = true

  constructor(rootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    EventService.on('logout', this, this.clear)
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

  isAdministrator() {
    if (this.isAuth && this.user?.userRole === 'administrator') {
      return true
    }
    return false
  }

  clear() {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('tokenDeathTime')
      this.setAuth(false)
      this.setUser({})
    } catch (error) {
      toast.error(error.response?.data?.message)
    }
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
      this.clear()
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
      }
      // else {
      //   console.log(1)
      //   this.clear()
      // }
    }

    this.setAuthLoading(false)
  }
}
