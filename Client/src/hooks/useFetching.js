import { useCallback, useState, useEffect } from 'react'

import toast from 'react-hot-toast'
import { useIsMounted } from './useIsMounted'

//хук обертка для запроса к серверу, который выводит тостер с ошибкой в случае некоректного выполнения
export const useFetching = () => {
  const isMounted = useIsMounted() //используем хук для определения что объект не демонтирован
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  //Запрос к серверу
  // используем useCallback с пустой зависимостью что бы функция создавалась только один раз
  const fetching = useCallback(
    async (callback, displayError = true) => {
      try {
        if (isMounted.current) {
          setLoading(true)
        } //если объект существует

        return await callback() //вызов переданной функции
      } catch (error) {
        //если отображать ошибку, то выводим тост с ошибкой
        if (displayError) {
          if (isMounted.current) {
            setError(error.response?.data?.message || error.message)
          }
          // иначе пробрасываем ошибку в место вызова функции
        } else {
          throw error
        }
      } finally {
        //finally выполняется в любом случае до передачи управления вызываемой функции
        if (isMounted.current) {
          setLoading(false)
        }
      }
    },
    [isMounted]
  )

  // очищаем ошибку
  const clearError = useCallback(() => setError(null), [])

  //Выводим ошибку
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  return { loading, fetching, error, clearError }
}
