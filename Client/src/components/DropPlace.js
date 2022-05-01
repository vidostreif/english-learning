import React, { useState, useEffect } from 'react'
import { useDrop } from 'react-dnd'
import classNames from 'classnames'

function DropPlace({
  correctElement,
  top,
  left,
  filledFunction,
  check,
  choiced,
  used,
}) {
  const [newInerElement, setNewInerElement] = useState() // новый элемент в поле
  const [text, setText] = useState('?') //элемент в поле
  const [isMistake, setMistake] = useState(false) //совершили ошибку
  const [isFilled, setFilled] = useState(false) //заполнили правильно ответ

  //метод перетаскивания на маркер
  // eslint-disable-next-line no-unused-vars
  const [{ isOver, isDidDrop, isActive }, drop] = useDrop(() => ({
    accept: 'div',
    drop: (item, monitor) => addTextToBoard(item.id, item.text, monitor),
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
  const addTextToBoard = (id, text, monitor) => {
    setNewInerElement((inerElement) => ({
      ...inerElement,
      id: id,
      text: text,
    }))
  }

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

  //нажали на маркер
  const wasClick = () => {
    if (!used) {
      const element = check()
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
  const liClasses = classNames({
    Marker: true,
    FillMarker: isFilled,
    EmptyMarker: !isFilled && !isMistake && !choiced && !isActive,
    MistakeMarker: isMistake,
    ChoicedMarker: choiced && !isFilled,
    CanFilledMarker: isActive && !isFilled,
  })

  return (
    <div
      className={liClasses}
      ref={drop}
      style={divStyle}
      onClick={wasClick}
      onAnimationEnd={(e) => {
        if (e.animationName === 'mistake') {
          setMistake(false)
        }
      }}
    >
      {text}
    </div>
  )
}

export default DropPlace
