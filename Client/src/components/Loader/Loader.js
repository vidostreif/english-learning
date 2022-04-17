import React from 'react'
import './Loader.css'

// отображение загрузки
const Loader = () => {
  return (
    <div class="loader__container">
      <div class="loader__ball loader__yellow"></div>
      <div class="loader__ball loader__red"></div>
      <div class="loader__ball loader__blue"></div>
      <div class="loader__ball loader__violet"></div>
    </div>
  )
}

export default Loader
