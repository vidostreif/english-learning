import { $api } from '../api'
import { USER_ROUTE } from '../utils/consts'

export default class UserServices {
  static async fetchUsers() {
    return $api.post(`${USER_ROUTE}/users`)
  }
}
