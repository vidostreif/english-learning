import { useState } from 'react'
import { Link } from 'react-router-dom'
import LoginForm from '../authorization/LoginForm'
import VModal from '../modal/VModal'
import './VHeader.scss'

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
          <button onClick={() => setModal(true)} className="header__login">
            <img
              src="/user.png"
              alt="иконка пользователя"
              className="header__login__img"
            />
          </button>
        </div>
      </header>
    </>
  )
}
