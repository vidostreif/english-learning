import React, { useEffect } from 'react'
import styles from './VModal.module.scss'

interface IProps {
  readonly visible: boolean
  readonly title: string
  readonly content: JSX.Element
  readonly footer: JSX.Element
  readonly onClose: () => void
}

const VModal: React.FC<IProps> = ({ visible = false, title = '', content = '', footer = '', onClose }) => {
  // создаем обработчик нажатия клавиши Esc
  const onKeydown = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'Escape':
        onClose()
        break
      default:
        break
    }
  }

  // c помощью useEffect цепляем обработчик к нажатию клавиш
  useEffect(() => {
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  })

  // если компонент невидим, то не отображаем его
  if (!visible) return null

  // или возвращаем верстку модального окна
  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles['modal-dialog']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['modal-header']}>
          <h3 className={styles['modal-title']}>{title}</h3>
          <span className={styles['modal-close']} onClick={onClose}>
            &times;
          </span>
        </div>
        <div className={styles['modal-body']}>
          <div className={styles['modal-content']}>{content}</div>
        </div>
        {footer && <div className={styles['modal-footer']}>{footer}</div>}
      </div>
    </div>
  )
}

export default VModal
