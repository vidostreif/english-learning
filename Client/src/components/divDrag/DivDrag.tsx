import { useDrag } from 'react-dnd'
import React, { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import ownStyles from './DivDrag.module.scss'

interface IProps {
  readonly id: number
  readonly text: string
  readonly check: () => IElement | null // проверка корректности заполнения
  readonly choiced: boolean // выбран в текущий момент
  readonly used: boolean // заполнен правильным словом
  readonly rootStyles: IStylesModule // стили которые передаются от родителя
}

interface IElement {
  readonly id: number
  readonly text: string
}

// перетаскиваемый блок
const DivDrag: React.FC<IProps> = ({ id, text, check, choiced, used, rootStyles }) => {
  const [isMistake, setMistake] = useState(false) //совершили ошибку
  const [styles, setStyles] = useState({ ...ownStyles, ...rootStyles }) //стили

  useEffect(() => {
    if (rootStyles) {
      setStyles({ ...ownStyles, ...rootStyles })
    }
  }, [rootStyles])

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'div',
    item: { id: id, text: text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    end: (item, monitor) => {
      //Здесь сообщаем, что мы переместили объект
      // if (monitor.getDropResult()?.id) {
      //   filledFunction()
      // }
    },
  }))

  const wasClick = () => {
    if (!used) {
      const result = check()

      if (result) {
        if (result.text !== text) {
          setMistake(true)
        }
      }
    }
  }

  //определяем классы текста
  let cx = classNames.bind(styles)
  const liClasses = cx({
    DragText: true,
    DragText__Mistake: isMistake && !used,
    DragText__Finish: used,
    DragText__Start: !used && !choiced,
    DragText__Choiced: choiced && !used,
    DragText__Dragging: isDragging,
  })

  return (
    <div
      className={liClasses}
      key={id}
      ref={drag}
      onClick={wasClick}
      onAnimationEnd={(e) => {
        if (e.animationName === 'word_mistake') {
          setMistake(false)
        }
      }}
    >
      {text}
    </div>
  )
}

export default DivDrag
