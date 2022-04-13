import { useDrag } from 'react-dnd'
import React, { useState } from 'react'
import classNames from 'classnames'

function DivDrag({ id, text, check, choiced, used }) {
  const [isMistake, setMistake] = useState(false) //совершили ошибку

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
  const liClasses = classNames({
    // Marker: true,
    MistakeWord: isMistake && !used,
    FinishWord: used,
    StartWord: !used && !choiced,
    ChoicedWord: choiced && !used,
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
