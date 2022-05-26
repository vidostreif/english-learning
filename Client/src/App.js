import './App.scss'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from './components/AppRouter'
import { VHeader } from './components/header/VHeader'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import Loader from './components/loader/Loader'
import { useStores } from './store/rootStore'

function App() {
  const { authStore, settingsStore } = useStores()
  //проверяем авторизацию
  useEffect(() => {
    authStore.checkAuth()
  }, [authStore])

  // загружаем настройки
  useEffect(() => {
    settingsStore.loadSettings()
  }, [settingsStore])

  return (
    <BrowserRouter>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <VHeader />
          {authStore.isAuthLoading || settingsStore.isSettingsLoading ? (
            <Loader />
          ) : (
            <AppRouter />
          )}

          <Toaster
            position="top-center"
            reverseOrder={false}

            // containerStyle={{
            //   position: 'absolute',
            // }}
          >
            {/* {(t) => (
              <ToastBar toast={t} >
                {({ icon, message }) => (
                  <>
                    {t.type === 'loading' && (
                      <>{icon}
                      {message}</>                      
                    )}
                    {t.type !== 'loading' && (
                      <div style={{display: 'flex'}} onClick={() => toast.dismiss(t.id)}><div className="">{icon}</div>
                      {message}</div>
                    )}
                  </>
                )}
                 </ToastBar>              
            )} */}
          </Toaster>
        </div>
      </DndProvider>
    </BrowserRouter>
  )
}

export default observer(App)
