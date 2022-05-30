import React, { useRef } from 'react'
import { useDrop, XYCoord } from 'react-dnd'
import { DivDragForEditor } from '../DivDragForEditor'
import styles from './DropPlaceForEditor.module.scss'

interface IProps {
  readonly hideSourceOnDrag: boolean
  readonly urlImg: string // адрес картинки
  readonly markers: Array<IMarker> // массив маркеров
  readonly addMarker: (e: React.MouseEvent<HTMLButtonElement>) => void // событие перемещения маркера
  readonly moveBox: (id: number, left: number, top: number) => void // событие добавления нового маркера
  readonly changeText: (id: number, value: string) => void // событие изменения текста
}

export const DropPlaceForEditor: React.FC<IProps> = ({
  hideSourceOnDrag,
  urlImg,
  markers,
  moveBox,
  addMarker,
  changeText,
}) => {
  const targetRef = useRef<HTMLImageElement>(null!)

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
      drop(item: IMarker, monitor) {
        const delta: XYCoord | null = monitor.getDifferenceFromInitialOffset()
        if (!delta) return undefined

        const left: number = Math.round(
          item.left + (delta.x / targetRef.current.clientWidth) * 100
        )
        const top: number = Math.round(
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
          className={styles.img}
          key="MainImg"
          id="MainImg"
          ref={targetRef}
        />
        {markers.map((marker, index) => {
          let { left, top, text } = marker

          return (
            <DivDragForEditor
              key={index}
              id={index}
              left={left}
              top={top}
              hideSourceOnDrag={hideSourceOnDrag}
              changeText={changeText}
              value={text}
            />
          )
        })}
      </div>
    </>
  )
}
