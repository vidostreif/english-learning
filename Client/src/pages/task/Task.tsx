import React, { useState, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import DivDrag from '../../components/divDrag/DivDrag'
import DropPlace from '../../components/dropPlace/DropPlace'
import { fetchTask, fetchRandomTask, setTaskPassed } from '../../services/taskService'
import { Link, useSearchParams } from 'react-router-dom'
import Loader from '../../components/loader/Loader'
import FiveStars from '../../components/fiveStars/FiveStars'
import { addTaskRating, fetchTaskRating } from '../../services/taskRatingService'
import RandomTaskList from '../../components/randomTaskList/RandomTaskList'
import styles from './Task.module.scss'
import { EDITOR_ROUTE, TASK_LIST_ROUTE } from '../../utils/consts'
import { useFetching } from '../../hooks/useFetching'
import { useStores } from '../../store/rootStore'
import toast from 'react-hot-toast'

const DragDrop = () => {
  const [searchParams, setSearchParams] = useSearchParams() //список параметров из url
  const [dictionary, setDictionary] = useState<Array<IMarkerForGame>>([]) //список слов
  const [markers, setMarkers] = useState<Array<IMarkerForGame>>([]) //список маркеров
  const [curText, setCurText] = useState<IMarkerForGame | null>(null) //слово по которому кликнули
  const [curMarker, setCurMarker] = useState<IMarkerForGame | null>(null) //маркер по которому кликнули
  const [taskIsDone, setTaskIsDone] = useState(false) // задание выполнено
  const [taskId, setTaskId] = useState<number | null>(null) // id текущего задания
  const [taskRating, setTaskRating] = useState(0) //оценка пользователя
  const [urlImg, setUrlImg] = useState('') // картинка текущего задания
  const [keyMarkers, setKeyMarkers] = useState(1) // ключи для маркеров и слов
  const { authStore } = useStores()

  const { loading: loadingTask, fetching: fetchingTask } = useFetching() //хук обертка для работы с сервером

  useEffect(() => {
    if (Number(searchParams.get('id')) !== taskId) {
      //запрашиваем задание с сервера
      getTaskFromServer(Number(searchParams.get('id')))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    //если авторизованы, запрашиваем оценку пользователя
    if (authStore.isAuth) {
      fetchTaskRating(Number(searchParams.get('id'))).then((data) => {
        if (data) {
          setTaskRating(data.rating)
        } else {
          setTaskRating(0)
        }
      })
    } else {
      setTaskRating(0)
    }
  }, [searchParams, authStore.isAuth])

  //получить задание
  const getTaskFromServer = (id: number | null) => {
    if (id) {
      fetchingTask(async (current: boolean) => {
        await fetchTask(id).then((data) => {
          // если этот объект еще монтирован
          if (current) setTaskParam(data)
        })
      })
    } else {
      toast.error('Потеряли id задания для выборки данных с сервера')
    }
  }

  //получить следующее рандомное задание
  const nextRandomTask = (id: number | null) => {
    if (id) {
      fetchingTask(async (current: boolean) => {
        await fetchRandomTask(1, id).then((data) => {
          // если этот объект еще монтирован
          if (current) setTaskParam(data[0])
        })
      })
    } else {
      toast.error('Потеряли id задания для выборки данных с сервера')
    }
  }

  //если получили новое задание
  const setTaskParam = (data: ITaskFromServer) => {
    const newMarkers: Array<IMarkerForGame> = data.Markers.map((element, index) => {
      return {
        id: index + keyMarkers,
        left: element.left,
        top: element.top,
        text: element.dictionary.name,
        choiced: false,
        used: false,
      }
    })
    setTaskIsDone(false)
    setDictionary(newMarkers)
    setMarkers(newMarkers)
    setKeyMarkers((prevKey) => prevKey + 100)
    setTaskId(data.id)
    if (Number(searchParams.get('id')) !== data.id) {
      setSearchParams({ id: data.id.toString() })
    }
    setUrlImg(`${process.env.REACT_APP_API_URL}/${data.imgUrl}`)
  }

  //пометка маркеров как использованные
  const delItem = (idText: number, idMarker: number) => {
    setDictionary((prevDictionary) =>
      prevDictionary.map((element) => (element.id === idText ? { ...element, used: true } : { ...element }))
    )

    let allUsed: boolean = true
    //Отмечаем маркер как использованный
    //Проверяем, если все маркеры использованы, то задание выполнено
    const newMarkersList: Array<IMarkerForGame> = markers.map((element) => {
      const newElement: IMarkerForGame = element.id === idMarker ? { ...element, used: true } : { ...element }

      if (!newElement.used) {
        allUsed = false
      }
      return newElement
    })
    setMarkers(newMarkersList)

    if (allUsed) {
      setTaskIsDone(true)
      if (taskId) setTaskPassed(taskId) // увеличение счетчика прохождения задания на сервере
    }
  }

  //Если выбрали какой-то текст
  const choicedText = (element: IMarkerForGame) => {
    if (curMarker) {
      const returnElement: { id: number; text: string } = {
        id: curMarker.id,
        text: curMarker.text,
      }
      if (element.text === curMarker.text) {
        delItem(element.id, curMarker.id)
      }
      dropChoiceText()
      dropChoiceMarker()
      return returnElement
    } else {
      setCurText(element)
      setDictionary((prevMarkers) =>
        prevMarkers.map((prevElement) =>
          prevElement.id === element.id ? { ...prevElement, choiced: !element.choiced } : { ...prevElement, choiced: false }
        )
      )
    }
    return null
  }

  //Сброс выбора текста
  const dropChoiceText = () => {
    setCurText(null)
    setDictionary((prevMarkers) => prevMarkers.map((prevElement) => ({ ...prevElement, choiced: false })))
  }

  //Если выбрали какой-то маркер
  const choicedMarker = (element: IMarkerForGame) => {
    if (curText) {
      const returnElement = { id: curText.id, text: curText.text }
      dropChoiceText()
      dropChoiceMarker()
      return returnElement
    } else {
      setCurMarker(element)
      setMarkers((prevMarkers) =>
        prevMarkers.map((prevElement) =>
          prevElement.id === element.id ? { ...prevElement, choiced: !element.choiced } : { ...prevElement, choiced: false }
        )
      )
    }
    return null
  }

  //Сброс выбора маркера
  const dropChoiceMarker = () => {
    setCurMarker(null)
    setMarkers((prevMarkers) => prevMarkers.map((prevElement) => ({ ...prevElement, choiced: false })))
  }

  return (
    <>
      <div className={styles.Task}>
        {/* Отображения слов для задания или, при завершении задания, выбор следующего */}
        <div className={styles.Words}>
          {!taskIsDone ? (
            !loadingTask ? (
              dictionary.map((element) => {
                return (
                  <DivDrag
                    key={element.id}
                    text={element.text}
                    id={element.id}
                    check={() => choicedText(element)}
                    choiced={element.choiced}
                    used={element.used}
                    rootStyles={styles}
                  />
                )
              })
            ) : (
              <Loader />
            )
          ) : (
            <div className={styles.Words__end}>
              <img src="/emoji/thumbsUp.png" alt="thumbs up" className={styles.Words__thumbsUp}></img>
              <FiveStars
                incomingRatingValue={taskRating}
                calBack={(rating) => {
                  if (authStore.isAuth && taskId) addTaskRating(taskId, rating)
                }}
              />
              <div className={styles.Words__nextLevel}>
                <RandomTaskList count={3} not_id={taskId} />
                <img src="/btn/random.png" alt="random" onClick={() => nextRandomTask(taskId)} className={styles.NextBtn}></img>
              </div>
            </div>
          )}
        </div>

        {/* Отображение доски задания с картинкой и маркерами */}
        <div className={styles.Board} key={keyMarkers}>
          {!loadingTask ? (
            <>
              <img src={urlImg} alt="1" className={styles.MainImg} />
              {markers.map((element) => {
                return (
                  <DropPlace
                    key={element.id}
                    correctElement={element}
                    top={element.top}
                    left={element.left}
                    filledFunction={(idText: number, idMarker: number) => delItem(idText, idMarker)}
                    check={() => choicedMarker(element)}
                    choiced={element.choiced}
                    used={element.used}
                    rootStyles={styles}
                  />
                )
              })}
            </>
          ) : (
            <Loader />
          )}
        </div>

        {/* Кнопки перехода */}
        <div className={styles.BottomNextBtn}>
          {authStore.isAdministrator() ? (
            <Link to={`${EDITOR_ROUTE}?id=${taskId}`}>
              <img src="/btn/list.png" alt="list" className={styles.NextBtn}></img>
            </Link>
          ) : (
            ''
          )}
          <Link to={TASK_LIST_ROUTE}>
            <img src="/btn/list.png" alt="list" className={styles.NextBtn}></img>
          </Link>
          <img src="/btn/random.png" alt="random" onClick={() => nextRandomTask(taskId)} className={styles.NextBtn}></img>
        </div>
      </div>
    </>
  )
}

export default observer(DragDrop)
