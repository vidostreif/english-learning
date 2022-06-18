import { useState, useCallback, useEffect } from 'react'
import { DropPlaceForEditor } from '../../components/dropPlaceForEditor/DropPlaceForEditor'
import DisplayImage from '../../components/displayImage/DisplayImage'
import DropPlaceBasket from '../../components/DropPlaceBasket'
import { createTask, fetchTask } from '../../services/taskService'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import styles from './Editor.module.scss'
import { useFetching } from '../../hooks/useFetching'

// страница редактирования задания
const Editor: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams() // забираем параметры из строки адреса
  const [taskId, setTaskId] = useState<number | null>(searchParams.get('id') ? Number(searchParams.get('id')) : null) // из параметров строки адреса берем id
  const [markers, setMarkers] = useState<Array<IMarker>>([]) // массив маркеров
  const [complexity, setComplexity] = useState(1) // сложность задания
  const [urlImg, setUrlImg] = useState('') // адрес картинки
  const [imgFile, setImgFile] = useState<File | null>(null) // файл картинки

  const { loading, fetching } = useFetching() //хук обертка для работы с сервером

  useEffect(() => {
    if (taskId) {
      getTaskFromServer(taskId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // вызывается при перемещении маркера
  const moveMarker = useCallback(
    (id: number, left: number, top: number): void => {
      setMarkers((markers) =>
        markers.map((marker, index) => {
          return index === id ? { ...marker, left, top } : marker
        })
      )
    },
    [setMarkers]
  )

  // событие изменения сложности задания
  const changeComplexity: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    setComplexity(+event.target.value)
  }

  // вызывается при изменении текста маркера
  const changeMarekerText = (id: number, text: string): void => {
    setMarkers((markers) => markers.map((marker, index) => (index === id ? { ...marker, text } : marker)))
  }

  // вызывается при добавлении маркера
  const addMarker = () => {
    setMarkers([...markers, { top: 5, left: 10, text: 'new' }])
  }

  // вызывается при удалении маркера
  const delMarket = (id: number | undefined) => {
    setMarkers((prev) =>
      prev.filter((mark, index) => {
        return index !== id
      })
    )
  }

  // событие изменения картинки
  const setImg = (img: File, url: string) => {
    setImgFile(img)
    setUrlImg(url)
  }

  // const [hideSourceOnDrag, setHideSourceOnDrag] = useState(true)
  // const toggle = useCallback(
  //   () => setHideSourceOnDrag(!hideSourceOnDrag),
  //   [hideSourceOnDrag]
  // )

  // сохранение задания
  const setTaskOnServer = () => {
    toast.promise(
      fetching(async () => {
        return await createTask(imgFile, markers, complexity, taskId)
      }, false),
      {
        loading: 'Сохраняем...',
        success: (data: ITaskFromServer) => {
          setTaskParam(data)
          return `Задание сохранено под индексом ${data.id}`
        },
        error: (err) => `Ошибка сохранения задания: ${err.toString()}`,
      },
      {
        id: 'saveTask',
        style: {
          minWidth: '300px',
          maxWidth: '300px',
        },
        success: {
          duration: 5000,
          //  icon: '🔥',
        },
      }
    )
  }

  // получение задания с сервера
  const getTaskFromServer = (id: number) => {
    fetchTask(id).then((data: ITaskFromServer) => {
      setTaskParam(data)
    })
  }

  // установка новых параметров задания
  const setTaskParam = (data: ITaskFromServer) => {
    const newMarkers = data.markers.map((element) => {
      return {
        left: element.left,
        top: element.top,
        text: element.dictionary.name,
      }
    })
    setComplexity(data.complexity)
    setMarkers(newMarkers)
    setTaskId(data.id)
    setSearchParams({ id: data.id.toString() })
    setUrlImg(`${process.env.REACT_APP_API_URL}/${data.imgUrl}`)
    setImgFile(null)
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.header__element}>
            <DropPlaceBasket active={delMarket} />
          </div>
          <div className={styles.header__element}>
            <label>
              Сложность:
              <select
                id="complexity"
                name="complexity"
                value={complexity}
                onChange={changeComplexity}
                className={styles.complexity}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </label>
          </div>
          <div className={styles.header__element}>
            <DisplayImage setImg={setImg} />
          </div>
        </div>
        <DropPlaceForEditor
          // hideSourceOnDrag={hideSourceOnDrag}
          urlImg={urlImg}
          markers={markers}
          moveMarker={moveMarker}
          changeMarekerText={changeMarekerText}
          addMarker={addMarker}
        />
        <button className={styles.button} onClick={setTaskOnServer}>
          Сохранить
        </button>
      </div>
    </>
  )
}

export default Editor
