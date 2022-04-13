import './App.css'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
// import DragDrop from './pages/DragDrop'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/AppRouter'

function App() {
  return (
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          {/* <DragDrop /> */}
          <AppRouter />
        </div>
      </DndProvider>
    </BrowserRouter>
  )
}

export default App
