import { $api, apiRefreshToken } from '../api'
import { API_USERS, API_USER_LOGIN, API_USER_LOGOUT } from '../utils/consts'

export default class AuthService {
  static async login(email: string, password: string): Promise<IUser> {
    const response = await $api.post(`${API_USER_LOGIN}`, { email, password })
    return response.data.user
  }

  static async registration(email: string, password: string): Promise<IUser> {
    const response = await $api.post(`${API_USERS}`, { email, password })
    return response.data.user
  }

  static async logout(): Promise<void> {
    await $api.post(`${API_USER_LOGOUT}`)
  }

  static async getUsers(): Promise<Array<IUser>> {
    const response = await $api.get(`${API_USERS}`)
    return response.data
  }

  static async refreshToken(): Promise<IUser | null> {
    const response = await apiRefreshToken()
    if (response) {
      return response.data.user
    } else {
      return null
    }
  }
}
