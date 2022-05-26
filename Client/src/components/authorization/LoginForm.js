import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import Loader from '../loader/Loader'
import Validator from '../../utils/Validator'
import ErrorList from './ErrorList'
import toast from 'react-hot-toast'
import './LoginForm.scss'
import { useStores } from '../../store/rootStore'

const LoginForm = () => {
  const [triedToRegister, setTriedToRegister] = useState(false) //пытались зарегестрироваться
  const [email, setEmail] = useState('')
  const [emailErrors, setEmailErrors] = useState([])
  const [password, setPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState([])
  const { authStore } = useStores()

  //проверяем авторизацию
  // useEffect(() => {
  //   store.checkAuth()
  // }, [store])

  if (authStore.isAuthLoading) {
    return <Loader />
  }

  const registration = () => {
    setTriedToRegister(true)
    const emailIsChecked = checkEmail(email)
    const passwordIsChecked = checkPassword(password)
    if (emailIsChecked && passwordIsChecked) {
      authStore.registration(email, password)
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
    return mistakes.length === 0
  }

  const checkPassword = (newPassword) => {
    const mistakes = Validator.checkPassword(newPassword)
    setPasswordErrors(mistakes)
    return mistakes.length === 0
  }

  if (!authStore.isAuth) {
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

        <button onClick={() => authStore.login(email, password)}>Войти</button>
        <button onClick={registration}>Зарегестрироваться</button>
      </div>
    )
  } else {
    return (
      <div>
        <h1>{`Пользователь авторизован как ${authStore.user?.email}`}</h1>
        <h1>
          {authStore.user?.isActivated
            ? `Пользователь активирован`
            : `Пользователь не активирован`}
        </h1>
        <button onClick={() => authStore.logout()}>Выйти</button>
      </div>
    )
  }
}

export default observer(LoginForm)
