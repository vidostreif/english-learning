import { observer } from 'mobx-react-lite'
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { authRoutes, publicRoutes } from '../routes'
import { useStores } from '../store/rootStore'
import { TASK_LIST_ROUTE } from '../utils/consts'

const AppRouter: React.FC = () => {
  const { authStore } = useStores()
  return (
    <Routes>
      {authStore.isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} />
      ))}
      <Route path="*" element={<Navigate to={TASK_LIST_ROUTE} />} />
    </Routes>
  )
}

export default observer(AppRouter)
