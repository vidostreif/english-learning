import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import { observer } from 'mobx-react-lite'
import Loader from '../Loader/Loader'
import AuthService from '../../services/AuthService'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { store } = useContext(Context)

  //если в стородже есть токен, то проверяем его валидность
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

  if (!store.isAuth) {
    return (
      <div>
        <h1>Авторизуйтесь или зарегестрируйтесь</h1>

        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          placeholder="Email"
        />

        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          placeholder="Password"
        />

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
