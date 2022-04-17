import { Link } from 'react-router-dom'
import './VHeader.css'

export function VHeader() {
  return (
    <>
      <header>
        <div className="header">
          <Link to="/" className="header__logo">
            <img
              src="/logo.png"
              alt="логотип Okey kity"
              className="header__logo__img"
            />
          </Link>
          <Link to="/login" className="header__login">
            <img
              src="/user.png"
              alt="иконка пользователя"
              className="header__login__img"
            />
          </Link>
        </div>
      </header>
    </>
  )
}