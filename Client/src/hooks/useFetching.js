import { useCallback, useState, useEffect } from 'react'

import toast from 'react-hot-toast'
import { useIsMounted } from './useIsMounted'

//хук обертка для запроса к серверу, который выводит тостер с ошибкой в случае некоректного выполнения
export const useFetching = () => {
  const isMounted = useIsMounted() //используем хук для определения что объект не демонтирован
  const [numberOfRequests, setNumberOfRequests] = useState(0) // количество текущий запросов
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  //Запрос к серверу
  // используем useCallback с пустой зависимостью что бы функция создавалась только один раз
  const fetching = useCallback(
    async (callback, displayError = true) => {
      try {
        if (isMounted.current) {
          setNumberOfRequests((numberOfRequests) => numberOfRequests + 1) // увеличиваем количество текущий запросов
          setLoading(true)
        } //если объект существует

        return await callback(isMounted.current) //вызов переданной функции с объектом в котором объявлялся useFetching
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
          setNumberOfRequests((numberOfRequests) => {
            if (numberOfRequests <= 1) setLoading(false) // если это последний работавший запрос, то указываем, что больше не загружаем
            return numberOfRequests - 1 // уменьшаем количество текущий запросов
          })
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
