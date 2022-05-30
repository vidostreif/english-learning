import React, { useEffect, useRef, useState } from 'react'
import styles from './FiveStars.module.scss'

interface IProps {
  readonly incomingRatingValue: number // стартовый рейтинг
  readonly showRatingValue: boolean // показывать цифры рейтинга
  readonly active: boolean // доступный для выбора нового рейтинга
  readonly calBack?: (value: number) => void // срабатывает при попытке изменить рейтинг
}

// отображение рейтинга задания
const FiveStars: React.FC<IProps> = ({
  incomingRatingValue = 0,
  showRatingValue = true,
  active = true,
  calBack,
}) => {
  const ratingActive = useRef<HTMLDivElement>(null!)
  const [ratingValue, setRatingValue] = useState(() => {
    if (incomingRatingValue) {
      return incomingRatingValue > 100 ? 100 : incomingRatingValue
    }
    return 0
  })
  const [overRatingValue, setOverRatingValue] = useState(ratingValue)

  useEffect(() => {
    setRatingValue(incomingRatingValue)
    setOverRatingValue(incomingRatingValue)
  }, [incomingRatingValue])

  useEffect(() => {
    ratingActive.current.style.width = `${overRatingValue}%`
    ratingActive.current.style.transition = `0.2s`
  }, [overRatingValue])

  const mouseOver = (rating: number): void => {
    if (active) {
      setOverRatingValue(rating)
    }
  }

  const mouseOut = (): void => {
    if (active) {
      setOverRatingValue(ratingValue)
    }
  }

  const onClick = (rating: number): void => {
    if (active) {
      setOverRatingValue(rating)
      setRatingValue(rating)
      if (calBack) {
        calBack(rating)
      }
    }
  }

  let divNumber: JSX.Element = <></>
  if (showRatingValue) {
    divNumber = (
      <div className={styles.rating__value}>
        {(overRatingValue * 0.05).toFixed(1)}
      </div>
    )
  }

  return (
    <div className={styles.rating}>
      <div className={styles.rating__body}>
        <div className={styles.rating__active} ref={ratingActive}></div>
        <div className={styles.rating__items}>
          <button
            className={styles.rating__item}
            name="rating"
            value="1"
            onMouseOver={() => mouseOver(20)}
            onMouseOut={() => mouseOut()}
            onClick={() => onClick(20)}
          />
          <button
            // type="radio"
            className={styles.rating__item}
            name="rating"
            value="2"
            onMouseOver={() => mouseOver(40)}
            onMouseOut={() => mouseOut()}
            onClick={() => onClick(40)}
          />
          <button
            // type="radio"
            className={styles.rating__item}
            name="rating"
            value="3"
            onMouseOver={() => mouseOver(60)}
            onMouseOut={() => mouseOut()}
            onClick={() => onClick(60)}
          />
          <button
            // type="radio"
            className={styles.rating__item}
            name="rating"
            value="4"
            onMouseOver={() => mouseOver(80)}
            onMouseOut={() => mouseOut()}
            onClick={() => onClick(80)}
          />
          <button
            // type="radio"
            className={styles.rating__item}
            name="rating"
            value="5"
            onMouseOver={() => mouseOver(100)}
            onMouseOut={() => mouseOut()}
            onClick={() => onClick(100)}
          />
        </div>
      </div>
      {divNumber}
    </div>
  )
}

export default FiveStars
