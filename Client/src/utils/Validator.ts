export default class Validator {
  static checkPassword(newPassword: string): Array<string> {
    const passLength = { min: 8, max: 32 }
    let mistakes: Array<string> = []
    if (!Validator.isLength(newPassword, passLength)) {
      mistakes.push(`Длинна пароля должна быть ${passLength.min}-${passLength.max} символов`)
    }
    if (!Validator.isHasUppercase(newPassword)) {
      mistakes.push(`Пароль должен содержать заглавную букву`)
    }
    if (!Validator.isHasLowercase(newPassword)) {
      mistakes.push(`Пароль должен содержать строчную букву`)
    }
    if (!Validator.isHasNumeric(newPassword)) {
      mistakes.push(`Пароль должен содержать цифру`)
    }
    if (!Validator.isHasSpecial(newPassword)) {
      mistakes.push(`Пароль должен содержать спец символ`)
    }

    return mistakes
  }

  static checkEmail(newEmail: string): Array<string> {
    let mistakes: Array<string> = []
    if (!Validator.isEmail(newEmail)) {
      mistakes.push(`Введите корректный e-mail`)
    }
    return mistakes
  }

  // проверка почты
  static isEmail(email: string): boolean {
    // /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // /^([A-Za-z0-9_\-.])+\@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/
    const reg: RegExp = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i
    if (reg.test(email) === false) {
      // alert('Введите корректный e-mail')
      return false
    }
    return true
  }

  // проверка что текст содержит необходимое количество символов
  static isLength(text: string, { min = 0, max = Infinity }): boolean {
    if (text.length >= min && text.length <= max) {
      return true
    }
    return false
  }

  // проверка что текст содержит хотя бы одну букву в верхнем регистре
  static isHasUppercase(text: string): boolean {
    for (let i = 0; i < text.length; i++) {
      if (text[i] === text[i].toUpperCase() && text[i] !== text[i].toLowerCase()) {
        return true
      }
    }
    return false
  }

  // проверка что текст содержит хотя бы одну букву в нижнем регистре
  static isHasLowercase(text: string): boolean {
    for (let i = 0; i < text.length; i++) {
      if (text[i] !== text[i].toUpperCase() && text[i] === text[i].toLowerCase()) {
        return true
      }
    }
    return false
  }

  // проверка что текст содержит хотя бы одну цифру
  static isHasNumeric(text: string): boolean {
    const nums: string = '0123456789'
    for (let i = 0; i < text.length; i++) {
      if (~nums.indexOf(text[i])) {
        return true
      }
    }
    return false
  }

  // проверка что текст содержит хотя бы один спец символ
  static isHasSpecial(text: string): boolean {
    const format: RegExp = /[!@#$%^&*()_+\-=[\]{};':"`~\\|,.<>/?]+/

    if (format.test(text)) {
      return true
    } else {
      return false
    }
  }
}
