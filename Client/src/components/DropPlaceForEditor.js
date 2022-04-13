// import { useCallback, useState, useRef, useLayoutEffect } from 'react'
import { useDrop } from 'react-dnd'
// import { ItemTypes } from './ItemTypes'
import { DivDragForEditor } from './DivDragForEditor'
// import update from 'immutability-helper'

const styles = {
  width: '100%',
  border: '1px solid black',
  position: 'relative',
}

export const DropPlaceForEditor = ({
  hideSourceOnDrag,
  urlImg,
  markers,
  moveBox,
  addMarker,
  changeText,
}) => {
  // const [boxes, setBoxes] = useState(markers)

  // const targetRef = useRef()
  // const [dimensions, setDimensions] = useState({ width: 10, height: 10 })

  // useLayoutEffect(() => {
  //   if (targetRef.current) {
  //     setDimensions({
  //       width: targetRef.current.offsetWidth,
  //       height: targetRef.current.offsetHeight,
  //     })
  //   }
  // }, [])

  // const moveBox = useCallback(
  //   (id, left, top) => {
  //     setBoxes(
  //       update(boxes, {
  //         [id]: {
  //           $merge: { left, top },
  //         },
  //       })
  //     )
  //   },
  //   [boxes, setBoxes]
  // )

  const [, drop] = useDrop(
    () => ({
      accept: 'divEditor',
      drop(item, monitor) {
        const delta = monitor.getDifferenceFromInitialOffset()
        const left = Math.round(
          item.left +
            (delta.x / document.querySelector('.MainImg').clientWidth) * 100
        )
        const top = Math.round(
          item.top +
            (delta.y / document.querySelector('.MainImg').clientHeight) * 100
        )

        moveBox(item.id, Math.max(left, 0), Math.max(top, 0))
        return undefined
      },
    }),
    [moveBox]
  )

  // const changeText = (id, title) => {
  //   setBoxes(
  //     update(boxes, {
  //       [id]: {
  //         $merge: { title },
  //       },
  //     })
  //   )
  // }

  // const addMarker = () => {
  //   setBoxes([...boxes, { top: 5, left: 10, title: 'new' }])
  // }

  return (
    <>
      <button onClick={addMarker}>+</button>
      <div ref={drop} style={styles}>
        <img
          src={urlImg}
          alt="1"
          className="MainImg"
          key="MainImg"
          id="MainImg"
          // ref={targetRef}
        />
        {/* <p>{dimensions.width}</p>
      <p>{dimensions.height}</p> */}
        {Object.keys(markers).map((key) => {
          let { left, top, text } = markers[key]
          // left = (left * dimensions.width) / 100
          // top = (top * dimensions.height) / 100
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
