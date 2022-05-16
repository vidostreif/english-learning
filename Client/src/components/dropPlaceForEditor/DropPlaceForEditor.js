// import { useCallback, useState, useRef, useLayoutEffect } from 'react'
import { useRef } from 'react'
import { useDrop } from 'react-dnd'
// import { ItemTypes } from './ItemTypes'
import { DivDragForEditor } from '../DivDragForEditor'
import styles from './DropPlaceForEditor.module.scss'

// const styles = {
//   width: '100%',
//   border: '1px solid black',
//   position: 'relative',
// }

export const DropPlaceForEditor = ({
  hideSourceOnDrag,
  urlImg,
  markers,
  moveBox,
  addMarker,
  changeText,
}) => {
  const targetRef = useRef()

  // useLayoutEffect(() => {
  //   if (targetRef.current) {
  //     setDimensions({
  //       width: targetRef.current.offsetWidth,
  //       height: targetRef.current.offsetHeight,
  //     })
  //   }
  // }, [])

  const [, drop] = useDrop(
    () => ({
      accept: 'divEditor',
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset()
        const left = Math.round(
          item.left + (delta.x / targetRef.current.clientWidth) * 100
        )
        const top = Math.round(
          item.top + (delta.y / targetRef.current.clientHeight) * 100
        )

        moveBox(item.id, Math.max(left, 0), Math.max(top, 0))
        return undefined
      },
    }),
    [moveBox]
  )

  return (
    <>
      <button onClick={addMarker} className={styles.button}>
        Добавить маркер
      </button>
      <div ref={drop} className={styles.container}>
        <img
          src={urlImg}
          alt="1"
          className="img"
          key="MainImg"
          id="MainImg"
          ref={targetRef}
        />
        {Object.keys(markers).map((key) => {
          let { left, top, text } = markers[key]
          return (
            <DivDragForEditor
              key={key}
              id={key}
              left={left}
              top={top}
              hideSourceOnDrag={hideSourceOnDrag}
              changeText={changeText}
            >
              {text}
            </DivDragForEditor>
          )
        })}
      </div>
    </>
  )
}
