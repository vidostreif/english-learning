import { makeAutoObservable } from 'mobx'
import AuthService from '../services/AuthService'

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
      console.log(response)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (error) {
      console.log(error.response?.data?.message)
    }
  }

  async registration(email, password) {
    try {
      const response = await AuthService.registration(email, password)
      console.log(response)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
    } catch (error) {
      console.log(error.response?.data?.message)
    }
  }

  async logout() {
    try {
      const response = await AuthService.logout()
      console.log(response)
      localStorage.removeItem('token')
      this.setAuth(false)
      this.setUser({})
    } catch (error) {
      console.log(error.response?.data?.message)
    }
  }

  async checkAuth() {
    this.setAuthLoading(true)

    const response = await AuthService.refreshToken()
    console.log(response)
    if (response) {
      this.setAuth(true)
      this.setUser(response.data.user)
    } else {
      this.setAuth(false)
      this.setUser({})
      // console.log(error.response?.data?.message)
    }

    this.setAuthLoading(false)
  }
}
