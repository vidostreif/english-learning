import React, { useState, useEffect } from 'react'
import '../App.css'
import DivDrag from '../components/DivDrag'
import DropPlace from '../components/DropPlace'
import { fetchTask, fetchRandomTask } from '../http/taskAPI'
import { Link, useSearchParams } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'

const DragDrop = (props) => {
  const [searchParams, setSearchParams] = useSearchParams() //список параметров из url
  const [dictionary, setDictionary] = useState([]) //список слов
  const [markers, setMarkers] = useState([]) //список маркеров
  const [curText, setCurText] = useState() //слово по которому кликнули
  const [curMarker, setCurMarker] = useState() //маркер по которому кликнули
  const [taskIsDone, setTaskIsDone] = useState(false) // задание выполнено
  const [taskId, setTaskId] = useState() // id текущего задания
  const [urlImg, setUrlImg] = useState() // картинка текущего задания
  const [keyMarkers, setKeyMarkers] = useState(1) // ключи для маркеров и слов

  useEffect(() => {
    if (searchParams.get('id') != taskId) {
      getTaskFromServer(searchParams.get('id'))
    }
  }, [searchParams])

  //удаление элемента из массива
  const delItem = (idText, idMarker) => {
    // setMarkers((prev) => prev.filter((item) => item.id !== id))
    setDictionary((prevDictionary) =>
      prevDictionary.map((element) =>
        element.id === idText ? { ...element, used: true } : { ...element }
      )
    )

    let allUsed = true
    //Отмечаем маркер как использованный
    //Проверяем, если все маркеры использованы, то задание выполнено
    const newMarkersList = markers.map((element) => {
      const newElement =
        element.id === idMarker ? { ...element, used: true } : { ...element }

      if (!newElement.used) {
        allUsed = false
      }
      return newElement
    })
    setMarkers(newMarkersList)

    if (allUsed) {
      setTaskIsDone(true)
    }
  }

  const getTaskFromServer = (id) => {
    fetchTask(id).then((data) => {
      setTaskParam(data)
    })
  }

  //получить следующее рандомное задание
  const nextRandomTask = (id) => {
    fetchRandomTask(id).then((data) => {
      setTaskParam(data)
    })
  }

  //если получили новое задание
  const setTaskParam = (data) => {
    const newMarkers = data.Markers.map((element, index) => {
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
    if (searchParams.get('id') != data.id) {
      setSearchParams({ id: data.id })
    }
    setUrlImg(process.env.REACT_APP_API_URL + data.imgUrl)
  }

  //Если выбрали какой-то текст
  const choicedText = (element) => {
    if (curMarker) {
      const returnElement = { id: curMarker.id, text: curMarker.text }
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
          prevElement.id === element.id
            ? { ...prevElement, choiced: !element.choiced }
            : { ...prevElement, choiced: false }
        )
      )
    }
    return null
  }

  //Сброс выбора текста
  const dropChoiceText = () => {
    setCurText(null)
    setDictionary((prevMarkers) =>
      prevMarkers.map((prevElement) => ({ ...prevElement, choiced: false }))
    )
  }

  //Если выбрали какой-то маркер
  const choicedMarker = (element) => {
    if (curText) {
      const returnElement = { id: curText.id, text: curText.text }
      dropChoiceText()
      dropChoiceMarker()
      return returnElement
    } else {
      setCurMarker(element)
      setMarkers((prevMarkers) =>
        prevMarkers.map((prevElement) =>
          prevElement.id === element.id
            ? { ...prevElement, choiced: !element.choiced }
            : { ...prevElement, choiced: false }
        )
      )
    }
    return null
  }

  //Сброс выбора маркера
  const dropChoiceMarker = () => {
    setCurMarker(null)
    setMarkers((prevMarkers) =>
      prevMarkers.map((prevElement) => ({ ...prevElement, choiced: false }))
    )
  }

  return (
    <div className="Task">
      {/* <button onClick={() => nextRandomTask(taskId)} className="NextBtn">
        next
      </button> */}
      <div className="Words">
        {!taskIsDone && dictionary.length > 0 ? (
          dictionary.map((element) => {
            return (
              <DivDrag
                key={element.id}
                text={element.text}
                id={element.id}
                // filledFunction={() => delItem(element.id)}
                check={() => choicedText(element)}
                choiced={element.choiced}
                used={element.used}
              />
            )
          })
        ) : (
          <img
            src="/btn/random.png"
            alt="random"
            onClick={() => nextRandomTask(taskId)}
            className="NextBtn"
          ></img>
        )}
      </div>
      <div className="Board" key={keyMarkers}>
        <img src={urlImg} alt="1" className="MainImg" />
        {markers.map((element) => {
          return (
            <DropPlace
              key={element.id}
              correctElement={element}
              top={element.top}
              left={element.left}
              filledFunction={(idText, idMarker) => delItem(idText, idMarker)}
              check={() => choicedMarker(element)}
              choiced={element.choiced}
              used={element.used}
            />
          )
        })}
      </div>
      <div className="BottomNextBtn">
        <Link to={`/task_list`}>
          <img src="/btn/list.png" alt="list" className="NextBtn"></img>
        </Link>

        <img
          src="/btn/random.png"
          alt="random"
          onClick={() => nextRandomTask(taskId)}
          className="NextBtn"
        ></img>
      </div>
    </div>
  )
}

export default DragDrop
