import { $api } from '../api'
import { API_USERS } from '../utils/consts'

export default class UserServices {
  static async fetchUsers() {
    return $api.post(API_USERS)
  }
}
