import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import Loader from '../loader/Loader'
import AuthService from '../../services/AuthService'
import Validator from '../../utils/Validator'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [emailIsCorrect, setEmailIsCorrect] = useState(true)
  const [emailErrors, setEmailErrors] = useState([])
  const [password, setPassword] = useState('')
  const [passwordIsCorrect, setPasswordIsCorrect] = useState(true)
  const [passwordErrors, setPasswordErrors] = useState([])
  const { store } = useContext(Context)

  //если в стородке есть токен, то проверяем его валидность
  useEffect(() => {
    if (localStorage.getItem('token')) {
      store.checkAuth()
    }
  }, [])

  if (store.isAuthLoading) {
    return <Loader />
  }

  const getUsers = async () => {
    console.log(await AuthService.getUsers())
  }

  const changeEmail = (newEmail) => {
    setEmail(newEmail)
    let mistakes = []
    if (!Validator.isEmail(newEmail)) {
      mistakes.push(`Введите корректный e-mail`)
    }
    setEmailIsCorrect(mistakes.length === 0)
    setEmailErrors(mistakes)
  }

  const changePassword = (newPassword) => {
    setPassword(newPassword)
    const passLength = { min: 8, max: 32 }
    let mistakes = []
    if (!Validator.isLength(newPassword, passLength)) {
      mistakes.push(
        `Длинна пароля должна быть ${passLength.min}-${passLength.max} символов`
      )
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

    setPasswordErrors(mistakes)
    setPasswordIsCorrect(mistakes.length === 0)
  }

  let ErrorEmail = <ul className="ErrorValidation"></ul>
  if (!emailIsCorrect) {
    ErrorEmail = (
      <ul className="ErrorValidation">
        {emailErrors.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    )
  }

  let ErrorPassword = <ul className="ErrorValidation"></ul>
  if (!passwordIsCorrect) {
    ErrorPassword = (
      <ul className="ErrorValidation">
        {passwordErrors.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    )
  }

  if (!store.isAuth) {
    return (
      <div>
        <h1>Авторизуйтесь или зарегестрируйтесь</h1>

        <input
          onChange={(e) => changeEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
        />
        {ErrorEmail}

        <input
          onChange={(e) => changePassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
        />
        {ErrorPassword}

        <button onClick={() => store.login(email, password)}>Войти</button>
        <button onClick={() => store.registration(email, password)}>
          Зарегестрироваться
        </button>
      </div>
    )
  } else {
    return (
      <div>
        <h1>{`Пользователь авторизован как ${store.user.email}`}</h1>
        <h1>
          {store.user.isActivated
            ? `Пользователь активирован`
            : `Пользователь не активирован`}
        </h1>
        <button onClick={() => store.logout()}>Выйти</button>
        <button onClick={() => getUsers()}>Получить пользователей</button>
      </div>
    )
  }
}

export default observer(LoginForm)
