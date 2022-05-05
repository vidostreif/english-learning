import { useState, useCallback, useEffect } from 'react'
import { DropPlaceForEditor } from '../components/DropPlaceForEditor'
import update from 'immutability-helper'
import DisplayImage from '../components/DisplayImage'
import DropPlaceBasket from '../components/DropPlaceBasket'
import { createTask, fetchTask } from '../http/taskAPI'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'

const Editor = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [taskId, setTaskId] = useState(searchParams.get('id'))
  const [markers, setMarkers] = useState([])
  const [complexity, setComplexity] = useState(1)
  const [urlImg, setUrlImg] = useState()
  const [imgFile, setImgFile] = useState()

  useEffect(() => {
    if (taskId) {
      getTaskFromServer(taskId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const moveBox = useCallback(
    (id, left, top) => {
      setMarkers(
        update(markers, {
          [id]: {
            $merge: { left, top },
          },
        })
      )
    },
    [markers, setMarkers]
  )

  const changeComplexity = (event) => {
    setComplexity(event.target.value)
  }
  const changeText = (id, text) => {
    setMarkers(
      update(markers, {
        [id]: {
          $merge: { text },
        },
      })
    )
  }

  const addMarker = () => {
    setMarkers([...markers, { top: 5, left: 10, text: 'new' }])
  }

  const delMarket = (item) => {
    setMarkers((prev) =>
      prev.filter((mark, index) => {
        return index !== item.id
      })
    )
  }

  const setImg = (img, url) => {
    setImgFile(img)
    setUrlImg(url)
  }

  const [hideSourceOnDrag, setHideSourceOnDrag] = useState(true)
  const toggle = useCallback(
    () => setHideSourceOnDrag(!hideSourceOnDrag),
    [hideSourceOnDrag]
  )

  const setTaskOnServer = () => {
    createTask(imgFile, markers, complexity, taskId)
      .then((data) => {
        setTaskParam(data)
        // console.log(data)
        toast.success('Задание сохранено!')
      })
      .catch((e) => {
        toast.error(e)
      })
  }

  const getTaskFromServer = (id) => {
    fetchTask(id).then((data) => {
      setTaskParam(data)
    })
  }

  const setTaskParam = (data) => {
    const newMarkers = data.Markers.map((element) => {
      return {
        left: element.left,
        top: element.top,
        text: element.dictionary.name,
      }
    })
    setComplexity(data.complexity)
    setMarkers(newMarkers)
    setTaskId(data.id)
    setSearchParams({ id: data.id })
    setUrlImg(`${process.env.REACT_APP_API_URL}/${data.imgUrl}`)
    setImgFile(null)
  }

  return (
    <>
      <div>
        <DropPlaceBasket active={delMarket} />
        <label>
          Complexity:
          <select
            id="complexity"
            name="complexity"
            value={complexity}
            onChange={changeComplexity}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </label>

        <DisplayImage setImg={setImg} />
        <DropPlaceForEditor
          hideSourceOnDrag={hideSourceOnDrag}
          urlImg={urlImg}
          markers={markers}
          moveBox={moveBox}
          changeText={changeText}
          addMarker={addMarker}
        />
        <p>
          <label htmlFor="hideSourceOnDrag">
            <input
              id="hideSourceOnDrag"
              type="checkbox"
              checked={hideSourceOnDrag}
              onChange={toggle}
            />
            <small>Hide the source item while dragging</small>
          </label>
        </p>
        <button onClick={setTaskOnServer}>Сохранить</button>
      </div>
    </>
  )
}

export default Editor
