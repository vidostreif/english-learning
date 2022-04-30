export default class Validator {
  // проверка почты
  static isEmail(email) {
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
    if (reg.test(email) === false) {
      // alert('Введите корректный e-mail')
      return false
    }
    return true
  }

  // проверка что текст содержит необходимое количество символов
  static isLength(text, { min = 0, max = Infinity }) {
    if (text.length >= min && text.length <= max) {
      return true
    }
    return false
  }

  // проверка что текст содержит хотя бы одну букву в верхнем регистре
  static isHasUppercase(text) {
    for (let i = 0; i < text.length; i++) {
      if (
        text[i] === text[i].toUpperCase() &&
        text[i] !== text[i].toLowerCase()
      ) {
        return true
      }
    }
    return false
  }

  // проверка что текст содержит хотя бы одну букву в нижнем регистре
  static isHasLowercase(text) {
    for (let i = 0; i < text.length; i++) {
      if (
        text[i] !== text[i].toUpperCase() &&
        text[i] === text[i].toLowerCase()
      ) {
        return true
      }
    }
    return false
  }

  // проверка что текст содержит хотя бы одну цифру
  static isHasNumeric(text) {
    const nums = '0123456789'
    for (let i = 0; i < text.length; i++) {
      if (~nums.indexOf(text[i])) {
        return true
      }
    }
    return false
  }
}
