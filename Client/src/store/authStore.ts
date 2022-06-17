import { makeAutoObservable } from 'mobx'
import AuthService from '../services/authService'
import toast from 'react-hot-toast'
import EventService from '../services/eventService'
import RootStore from './rootStore'

const guest: IUser = { id: 0, name: 'Гость', email: '', isActivated: false, userRole: 'guest' }

export default class AuthStore {
  user: IUser = guest
  isAuth: boolean = false
  isAuthLoading: boolean = false
  rootStore: RootStore

  constructor(rootStore: RootStore) {
    makeAutoObservable(this)
    this.rootStore = rootStore
    EventService.on('logout', this, this.clear)
  }

  setAuth(bool: boolean) {
    this.isAuth = bool
  }

  setUser(user: IUser) {
    this.user = user
  }

  setAuthLoading(bool: boolean) {
    this.isAuthLoading = bool
  }

  isAdministrator() {
    if (this.isAuth && this.user.userRole === 'administrator') {
      return true
    }
    return false
  }

  clear() {
    // try {
    localStorage.removeItem('token')
    localStorage.removeItem('tokenDeathTime')
    this.setAuth(false)
    this.setUser(guest)
    // } catch (error) {
    //   toast.error(error.response?.data?.message)
    // }
  }

  async login(email: string, password: string) {
    const user: IUser = await AuthService.login(email, password)

    toast(`И снова привет ${user.email}`, {
      icon: '🖐',
    })
    this.setAuth(true)
    this.setUser(user)
  }

  async registration(email: string, password: string) {
    const user: IUser = await AuthService.registration(email, password)
    toast(`Вы успешно зарегестрированы ${user.email}`, {
      icon: '🎉',
    })
    this.setAuth(true)
    this.setUser(user)
  }

  async logout() {
    await AuthService.logout()
    toast(`Досвидания!`, {
      icon: '👋',
    })
    this.clear()
  }

  //если в стороке есть токен, то проверяем его валидность
  async checkAuth() {
    if (this.isAuthLoading) return
    this.setAuthLoading(true)

    if (localStorage.getItem('token')) {
      const user: IUser | null = await AuthService.refreshToken()
      if (user) {
        this.setAuth(true)
        this.setUser(user)
      }
    }

    this.setAuthLoading(false)
  }
}
