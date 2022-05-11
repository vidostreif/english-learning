import { observer } from 'mobx-react-lite'
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
// import Task from '../pages/Task'
import { authRoutes, publicRoutes } from '../routes'
import { TASK_LIST_ROUTE } from '../utils/consts'

const AppRouter = ({ store }) => {
  return (
    <Routes>
      {store.isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} exact />
        ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} exact />
      ))}
      <Route path="*" element={<Navigate to={TASK_LIST_ROUTE} />} />
    </Routes>
  )
}

export default observer(AppRouter)
