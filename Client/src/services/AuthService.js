import { $api, apiRefreshToken } from '../http'
import {
  API_USER_LOGIN,
  API_USER_LOGOUT,
  API_USER_REGISTRATION,
  API_USER_USERS,
} from '../utils/consts'

export default class AuthService {
  static async login(email, password) {
    return $api.post(`${API_USER_LOGIN}`, { email, password })
  }

  static async registration(email, password) {
    return $api.post(`${API_USER_REGISTRATION}`, { email, password })
  }

  static async logout() {
    return $api.post(`${API_USER_LOGOUT}`)
  }

  static async getUsers() {
    return $api.get(`${API_USER_USERS}`)
  }

  static async refreshToken() {
    return apiRefreshToken()
  }
}
