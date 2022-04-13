import { useDrop } from 'react-dnd'

const styles = {
  width: '100px',
  height: '100px',
  border: '1px solid black',
  position: 'relative',
}

function DropPlaceBasket({ active }) {
  const [{ isOver, isDidDrop }, drop] = useDrop(() => ({
    accept: 'divEditor',
    drop: (item, monitor) => active(item),
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
