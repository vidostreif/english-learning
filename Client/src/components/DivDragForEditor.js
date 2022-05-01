import { useDrag } from 'react-dnd'

const style = {
  position: 'absolute',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  cursor: 'move',
  transform: 'translate(-50%, -50%)',
}

export const DivDragForEditor = ({
  id,
  left,
  top,
  hideSourceOnDrag,
  children,
  changeText,
}) => {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: 'divEditor',
      item: { id, left, top },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [id, left, top]
  )
  if (isDragging && hideSourceOnDrag) {
    return <div ref={drag} />
  }

  const onChange = (s) => {
    changeText(id, s.target.value)
  }

  return (
    <div
      ref={drag}
      style={{ ...style, left: left + '%', top: top + '%' }}
      // role="Box"
    >
      <input
        id="id"
        type="text"
        value={children}
        size="10"
        onChange={onChange}
      />
    </div>
  )
}
