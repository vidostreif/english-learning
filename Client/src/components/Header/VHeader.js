import { useState } from 'react'
import { Link } from 'react-router-dom'
// import { AUTH_ROUTE } from '../../utils/consts'
import LoginForm from '../authorization/LoginForm'
import VModal from '../modal/VModal'
import './VHeader.css'

export function VHeader() {
  const [isModal, setModal] = useState(false)
  const onClose = () => setModal(false)
  return (
    <>
      <header>
        <VModal
          visible={isModal}
          title="Авторизация"
          content={<LoginForm />}
          footer={<button onClick={onClose}>Закрыть</button>}
          onClose={onClose}
        />

        <div className="header">
          <Link to="/" className="header__logo">
            <img
              src="/logo.png"
              alt="логотип Okey kity"
              className="header__logo__img"
            />
          </Link>
          {/* <Link to={AUTH_ROUTE} className="header__login"> */}
          <img
            onClick={() => setModal(true)}
            src="/user.png"
            alt="иконка пользователя"
            className="header__login__img"
          />
          {/* </Link> */}
        </div>
      </header>
    </>
  )
}
