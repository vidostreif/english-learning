module.exports = class UserDto {
  name
  email
  id
  isActivated
  userRole

  constructor(model) {
    this.name = model.name
    this.email = model.email
    this.id = model.id
    this.isActivated = model.isActivated
    this.userRole = model.userRole.dataValues.name
  }
}
