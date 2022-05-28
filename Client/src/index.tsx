import React from 'react'
import ReactDOM from 'react-dom/client'
// import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './App'

// const container = document.getElementById('root')
// const root = createRoot(container!) // createRoot(container!) if you use TypeScript
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// )

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
