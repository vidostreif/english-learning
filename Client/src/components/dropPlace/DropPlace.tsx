import React, { useState, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import classNames from 'classnames/bind'
import ownStyles from './DropPlace.module.scss'

interface IProps {
  readonly correctElement: IMarkerForGame // параметры правильного маркера
  readonly top: number // положение по вертикали
  readonly left: number // положение по горизонтали
  readonly filledFunction: (idText: number, idMarker: number) => void // событие заполнения маркера
  readonly check: () => IElement | null // проверка корректности заполнения
  readonly choiced: boolean // выбран в текущий момент
  readonly used: boolean // заполнен правильным словом
  readonly rootStyles: IStylesModule // стили которые передаются от родителя
}

interface IElement {
  readonly id: number
  readonly text: string
}

//поле для заполнения
const DropPlace: React.FC<IProps> = ({ correctElement, top, left, filledFunction, check, choiced, used, rootStyles }) => {
  const [newInerElement, setNewInerElement] = useState<IElement>() // новый элемент в поле
  const [text, setText] = useState('?') //элемент в поле
  const [isMistake, setMistake] = useState(false) //совершили ошибку
  const [isFilled, setFilled] = useState(false) //заполнили правильно ответ
  const [styles, setStyles] = useState<IStylesModule>({ ...ownStyles, ...rootStyles }) //стили

  useEffect(() => {
    if (rootStyles) {
      setStyles({ ...ownStyles, ...rootStyles })
    }
  }, [rootStyles])

  useEffect(() => {
    //если поле не заполнено и пришел новый элемент с правильным текстом, то отмечаем как заполненное поле
    if (!isFilled && newInerElement) {
      if (correctElement.text === newInerElement.text) {
        filledFunction(newInerElement.id, correctElement.id)
      } else {
        setMistake(true)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newInerElement])

  //метод перетаскивания на маркер
  // eslint-disable-next-line no-unused-vars
  const [{ isOver, isDidDrop, isActive }, drop] = useDrop(() => ({
    accept: 'div',
    drop: (item: IElement, monitor) => addTextToBoard(item.id, item.text, monitor),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      isDidDrop: !!monitor.didDrop(),
      isActive: monitor.canDrop() && monitor.isOver(),
    }),
    canDrop: (item, monitor) => {
      return true
    },
  }))

  //если перетащили слово на маркер
  const addTextToBoard = (id: number, text: string, monitor: any) => {
    setNewInerElement((inerElement) => ({
      ...inerElement,
      id: id,
      text: text,
    }))
  }

  //нажали на маркер
  const wasClick = () => {
    if (!used) {
      const element: IElement | null = check()
      if (element) {
        setNewInerElement((inerElement) => ({
          ...inerElement,
          id: element.id,
          text: element.text,
        }))
      }
    }
  }

  if (used && !isFilled) {
    setText(correctElement.text)
    setFilled(true)
  }

  //расположение маркера
  const divStyle = {
    top: top + '%',
    left: left + '%',
  }

  //определяем классы маркера
  let cx = classNames.bind(styles)
  const liClasses = cx({
    Marker: true,
    Marker__Fill: isFilled,
    Marker__Empty: !isFilled && !isMistake && !choiced && !isActive,
    Marker__Mistake: isMistake,
    Marker__Choiced: choiced && !isFilled,
    Marker__CanFilled: isActive && !isFilled,
  })

  return (
    <>
      <div
        className={liClasses}
        ref={drop}
        style={divStyle}
        onClick={wasClick}
        onAnimationEnd={(e) => {
          if (e.animationName === styles.mistake) {
            setMistake(false)
          }
        }}
      >
        {text}
      </div>
    </>
  )
}

export default DropPlace
