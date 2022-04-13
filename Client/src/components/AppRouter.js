import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
// import Task from '../pages/Task'
import { authRoutes, publicRoutes } from '../routes'

const AppRouter = () => {
  const isAuth = true
  return (
    <Routes>
      {isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route key={path} path={path} element={<Component />} exact />
        ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route key={path} path={path} element={<Component />} exact />
      ))}
      <Route path="*" element={<Navigate to="/task_list" />} />
    </Routes>
  )
}

export default AppRouter
