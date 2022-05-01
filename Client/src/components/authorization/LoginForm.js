import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import Loader from '../loader/Loader'
import Validator from '../../utils/Validator'
import ErrorList from './ErrorList'
import toast from 'react-hot-toast'

const LoginForm = () => {
  const [triedToRegister, setTriedToRegister] = useState(false) //пытались зарегестрироваться
  const [email, setEmail] = useState('')
  // const [emailIsCorrect, setEmailIsCorrect] = useState(true)
  const [emailErrors, setEmailErrors] = useState([])
  const [password, setPassword] = useState('')
  // const [passwordIsCorrect, setPasswordIsCorrect] = useState(true)
  const [passwordErrors, setPasswordErrors] = useState([])
  const { store } = useContext(Context)

  //проверяем авторизацию
  useEffect(() => {
    store.checkAuth()
  }, [])

  if (store.isAuthLoading) {
    return <Loader />
  }

  const registration = () => {
    setTriedToRegister(true)
    const emailIsChecked = checkEmail(email)
    const passwordIsChecked = checkPassword(password)
    if (emailIsChecked && passwordIsChecked) {
      store.registration(email, password)
    } else {
      toast.error('В форме регистрации есть ошибки')
    }
  }

  const changeEmail = (newEmail) => {
    setEmail(newEmail)
    if (triedToRegister) {
      checkEmail(newEmail)
    }
  }

  const changePassword = (newPassword) => {
    setPassword(newPassword)
    if (triedToRegister) {
      checkPassword(newPassword)
    }
  }

  const checkEmail = (newEmail) => {
    const mistakes = Validator.checkEmail(newEmail)
    setEmailErrors(mistakes)
    // setEmailIsCorrect(mistakes.length === 0)
    return mistakes.length === 0
  }

  const checkPassword = (newPassword) => {
    const mistakes = Validator.checkPassword(newPassword)
    setPasswordErrors(mistakes)
    // setPasswordIsCorrect(mistakes.length === 0)
    return mistakes.length === 0
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
        <ErrorList list={emailErrors} />

        <input
          onChange={(e) => changePassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
        />
        <ErrorList list={passwordErrors} />

        <button onClick={() => store.login(email, password)}>Войти</button>
        <button onClick={registration}>Зарегестрироваться</button>
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
      </div>
    )
  }
}

export default observer(LoginForm)
