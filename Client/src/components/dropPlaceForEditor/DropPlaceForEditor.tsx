import React, { useRef } from 'react'
import { useDrop, XYCoord } from 'react-dnd'
import toast from 'react-hot-toast'
import { DivDragForEditor } from '../DivDragForEditor'
import styles from './DropPlaceForEditor.module.scss'

interface IProps {
  readonly hideSourceOnDrag?: boolean
  readonly urlImg: string // адрес картинки
  readonly markers: Array<IMarker> // массив маркеров
  readonly addMarker: (e: React.MouseEvent<HTMLButtonElement>) => void // событие добавления нового маркера
  readonly moveMarker: (id: number, left: number, top: number) => void // событие перемещения маркера
  readonly changeMarekerText: (id: number, value: string) => void // событие изменения текста
}

// доска задания для редактирования
export const DropPlaceForEditor: React.FC<IProps> = ({
  hideSourceOnDrag = false,
  urlImg,
  markers,
  moveMarker,
  addMarker,
  changeMarekerText,
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

  // перехват события перемещения маркера
  const [, drop] = useDrop(
    () => ({
      accept: 'divEditor',
      drop(item: IMarker, monitor) {
        const delta: XYCoord | null = monitor.getDifferenceFromInitialOffset()
        if (!delta) {
          toast.error(' не удалось определить delta маркера')
          return undefined
        }
        if (!item.id && item.id !== 0) {
          toast.error(' не удалось определить id маркера')
          return undefined
        }

        const left: number = Math.round(item.left + (delta.x / targetRef.current.clientWidth) * 100)
        const top: number = Math.round(item.top + (delta.y / targetRef.current.clientHeight) * 100)

        moveMarker(item.id, Math.max(left, 0), Math.max(top, 0))
        return undefined
      },
    }),
    [moveMarker]
  )

  return (
    <>
      <button onClick={addMarker} className={styles.button}>
        Добавить маркер
      </button>
      <div ref={drop} className={styles.container}>
        <img src={urlImg} alt="1" className={styles.img} key="MainImg" id="MainImg" ref={targetRef} />
        {markers.map((marker, index) => {
          let { left, top, text } = marker

          return (
            <DivDragForEditor
              key={index}
              id={index}
              left={left}
              top={top}
              hideSourceOnDrag={hideSourceOnDrag}
              changeText={changeMarekerText}
              value={text}
            />
          )
        })}
      </div>
    </>
  )
}
