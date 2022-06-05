import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import Loader from '../loader/Loader'
import Validator from '../../utils/Validator'
import ErrorList from './ErrorList'
import toast from 'react-hot-toast'
import styles from './LoginForm.module.scss'
import { useStores } from '../../store/rootStore'
import { useFetching } from '../../hooks/useFetching'

const LoginForm: React.FC = () => {
  const [triedToRegister, setTriedToRegister] = useState(false) //пытались зарегестрироваться
  const [email, setEmail] = useState('')
  const [emailErrors, setEmailErrors] = useState<Array<string>>([])
  const [password, setPassword] = useState('')
  const [passwordErrors, setPasswordErrors] = useState<Array<string>>([])
  const { authStore } = useStores()
  const { loading, fetching } = useFetching()

  //проверяем авторизацию
  // useEffect(() => {
  //   store.checkAuth()
  // }, [store])

  if (authStore.isAuthLoading || loading) {
    return <Loader />
  }

  const registration = () => {
    setTriedToRegister(true)
    const emailIsChecked = checkEmail(email)
    const passwordIsChecked = checkPasswordForRegistration(password)
    if (emailIsChecked && passwordIsChecked) {
      fetching(async () => await authStore.registration(email, password))
    } else {
      toast.error('В форме регистрации есть ошибки')
    }
  }

  const login = () => {
    // проверяем что введена синтактически верная почта
    const emailIsChecked = checkEmail(email)
    // проверяем что введен минимальный пароль
    const passwordIsChecked = checkPasswordForLogin(password)
    if (emailIsChecked && passwordIsChecked) {
      // логинимся
      fetching(async () => await authStore.login(email, password))
    } else {
      toast.error('Введите корректные данные входа')
    }
  }

  const changeEmail = (newEmail: string) => {
    setEmail(newEmail)
    if (triedToRegister) {
      checkEmail(newEmail)
    }
  }

  const changePassword = (newPassword: string) => {
    setPassword(newPassword)
    if (triedToRegister) {
      checkPasswordForRegistration(newPassword)
    }
  }

  const checkEmail = (newEmail: string) => {
    const mistakes = Validator.checkEmail(newEmail)
    setEmailErrors(mistakes)
    return mistakes.length === 0
  }

  const checkPasswordForRegistration = (newPassword: string) => {
    const mistakes = Validator.checkPassword(newPassword)
    setPasswordErrors(mistakes)
    return mistakes.length === 0
  }

  const checkPasswordForLogin = (newPassword: string) => {
    if (!Validator.isLength(newPassword, { min: 1 })) {
      setPasswordErrors(['Введите пароль'])
      return false
    }
    return true
  }

  if (!authStore.isAuth) {
    return (
      <div className={styles.container}>
        <h2 className={styles.container__header}>Авторизуйтесь или зарегестрируйтесь</h2>

        <input
          className={styles.container__input}
          onChange={(e) => changeEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
        />
        <ErrorList list={emailErrors} />

        <input
          className={styles.container__input}
          onChange={(e) => changePassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
        />
        <ErrorList list={passwordErrors} />

        <button className={styles.container__button} onClick={login}>
          Войти
        </button>
        <button className={styles.container__button} onClick={registration}>
          Зарегестрироваться
        </button>
      </div>
    )
  } else {
    return (
      <div className={styles.container}>
        <h3>{`Пользователь авторизован как ${authStore.user?.email}`}</h3>
        <h3>{authStore.user?.isActivated ? `Пользователь активирован` : `Пользователь не активирован`}</h3>
        <button className={styles.container__button} onClick={() => authStore.logout()}>
          Выйти
        </button>
      </div>
    )
  }
}

export default observer(LoginForm)
