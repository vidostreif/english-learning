import { useCallback, useState, useEffect } from 'react'
import axios, { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useIsMounted } from './useIsMounted'

//хук обертка для запроса к серверу, который выводит тостер с ошибкой в случае некоректного выполнения
export const useFetching = () => {
  const isMounted = useIsMounted() //используем хук для определения что объект не демонтирован
  const [numberOfRequests, setNumberOfRequests] = useState(0) // количество текущий запросов
  const [loading, setLoading] = useState(false) // состояние выполнения запроса
  const [error, setError] = useState('') // ошибка

  //Запрос к серверу
  // используем useCallback с пустой зависимостью что бы функция создавалась только один раз
  const fetching = useCallback(
    async (callback: Function, displayError: boolean = true) => {
      try {
        if (isMounted.current) {
          setNumberOfRequests((numberOfRequests) => numberOfRequests + 1) // увеличиваем количество текущий запросов
          setLoading(true)
        } //если объект существует

        return await callback(isMounted.current) //вызов переданной функции с объектом в котором объявлялся useFetching
      } catch (error: unknown) {
        //если отображать ошибку, то выводим тост с ошибкой
        if (displayError) {
          if (isMounted.current) {
            if (axios.isAxiosError(error)) {
              // если ошибка от axios то берем данные из response
              setError((error.response?.data as IErrorMessage).message)
            } else if (error instanceof Error) {
              // если типовая ошибка, то просто выводим сообщение
              setError(error.message)
            } else {
              // если не определили, то пробрасываем дальше
              throw error
            }
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

  // получаем сколько активных запросов в текущий момент
  const GetNumberOfRequests = useCallback(() => numberOfRequests, [numberOfRequests])
  // очищаем ошибку
  const clearError = useCallback(() => setError(''), [])

  //Выводим ошибку
  useEffect(() => {
    if (error) {
      toast.error(error)
      clearError()
    }
  }, [error, clearError])

  return { loading, fetching, error, clearError, GetNumberOfRequests }
}
