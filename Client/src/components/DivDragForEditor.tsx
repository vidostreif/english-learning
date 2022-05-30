import { useDrag } from 'react-dnd'

interface IProps {
  readonly id: number // id маркера
  readonly left: number // позиция по горизонтали
  readonly top: number // позиция по вертикали
  readonly hideSourceOnDrag: boolean
  readonly value: string // текст маркера
  readonly changeText: (id: number, value: string) => void // срабатывает при изименении текста
}

const style: React.CSSProperties = {
  position: 'absolute',
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  cursor: 'move',
  transform: 'translate(-50%, -50%)',
}

export const DivDragForEditor: React.FC<IProps> = ({
  id,
  left,
  top,
  hideSourceOnDrag,
  value,
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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    changeText(id, e.target.value)
  }

  return (
    <div
      ref={drag}
      style={{ ...style, left: left + '%', top: top + '%' }}
      // role="Box"
    >
      <input id="id" type="text" value={value} size={10} onChange={onChange} />
    </div>
  )
}
