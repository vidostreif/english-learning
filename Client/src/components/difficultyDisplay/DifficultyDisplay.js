import React from 'react'
import './DifficultyDisplay.scss'

// отображение сложности задания
const DifficultyDisplay = ({ complexity = 0 }) => {
  return (
    <div className="DifficultyDisplay">
      <div
        className={
          complexity > 0
            ? 'DifficultyDisplay__active1 DifficultyDisplay__Line1'
            : 'DifficultyDisplay__Line1'
        }
      ></div>
      <div
        className={
          complexity > 1
            ? 'DifficultyDisplay__active2 DifficultyDisplay__Line2'
            : 'DifficultyDisplay__Line2'
        }
      ></div>
      <div
        className={
          complexity > 2
            ? 'DifficultyDisplay__active3 DifficultyDisplay__Line3'
            : 'DifficultyDisplay__Line3'
        }
      ></div>
      <div
        className={
          complexity > 3
            ? 'DifficultyDisplay__active4 DifficultyDisplay__Line4'
            : 'DifficultyDisplay__Line4'
        }
      ></div>
      <div
        className={
          complexity > 4
            ? 'DifficultyDisplay__active5 DifficultyDisplay__Line5'
            : 'DifficultyDisplay__Line5'
        }
      ></div>
    </div>
  )
}

export default DifficultyDisplay
