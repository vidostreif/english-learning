import { useDrop } from 'react-dnd'

interface IProps {
  readonly active: (id: number | undefined) => void // событие активации корзины
}

const styles: React.CSSProperties = {
  width: '100px',
  height: '100px',
  border: '1px solid #008b8b',
  position: 'relative',
  borderRadius: '5px',
  backgroundColor: '#008b8b2d',
}

// мусорная корзина для редактора
const DropPlaceBasket: React.FC<IProps> = ({ active }) => {
  // eslint-disable-next-line no-unused-vars
  const [{ isOver, isDidDrop }, drop] = useDrop(() => ({
    accept: 'divEditor',
    drop: (item: IMarker, monitor) => active(item.id),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      isDidDrop: !!monitor.didDrop(),
    }),
    canDrop: (item, monitor) => {
      return true
    },
  }))

  return (
    <div ref={drop} style={styles}>
      корзина
    </div>
  )
}

export default DropPlaceBasket
