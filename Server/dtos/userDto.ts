// Ограничитель данных пользователя
// Передается с ключём
// Подставляется в запрос при проверки авторизации

import { User } from '../db/models'

export default class UserDto {
  public readonly name: string
  public readonly email: string
  public readonly id: number
  public readonly isActivated: boolean
  public readonly userRole: string

  constructor(model: User) {
    this.name = model.name
    this.email = model.email
    this.id = model.id
    this.isActivated = model.isActivated
    this.userRole = model.userRole.name
  }
}
