import { useState, useCallback, useEffect } from 'react'
import { DropPlaceForEditor } from '../components/DropPlaceForEditor'
import update from 'immutability-helper'
import DisplayImage from '../components/DisplayImage'
import DropPlaceBasket from '../components/DropPlaceBasket'
import { createTask, fetchTask } from '../http/taskAPI'
import { useSearchParams } from 'react-router-dom'

const Editor = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [taskId, setTaskId] = useState(searchParams.get('id'))
  const [markers, setMarkers] = useState([])
  const [urlImg, setUrlImg] = useState()
  const [imgFile, setImgFile] = useState()

  useEffect(() => {
    if (taskId) {
      getTaskFromServer(taskId)
    }
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
        return index != item.id
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
    createTask(imgFile, markers, taskId)
      .then((data) => {
        setTaskParam(data)
      })
      .catch((e) => {
        console.log(e)
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
    setMarkers(newMarkers)
    setTaskId(data.id)
    setSearchParams({ id: data.id })
    setUrlImg(process.env.REACT_APP_API_URL + data.imgUrl)
    setImgFile(null)
  }

  return (
    <div>
      <DropPlaceBasket active={delMarket} />
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
            role="checkbox"
            checked={hideSourceOnDrag}
            onChange={toggle}
          />
          <small>Hide the source item while dragging</small>
        </label>
      </p>
      <button onClick={setTaskOnServer}>Сохранить</button>
    </div>
  )
}

export default Editor
