import React from 'react'
import './Loader.css'

// отображение загрузки
const Loader = () => {
  return (
    <div className="loader__container">
      <div className="loader__ball loader__yellow"></div>
      <div className="loader__ball loader__red"></div>
      <div className="loader__ball loader__blue"></div>
      <div className="loader__ball loader__violet"></div>
    </div>
  )
}

export default Loader
