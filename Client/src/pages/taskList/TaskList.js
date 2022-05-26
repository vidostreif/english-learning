import React, { useState, useEffect, useRef, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { fetchAllTask } from '../../services/taskService'
import Loader from '../../components/loader/Loader.js'
import TaskCard from '../../components/taskCard/TaskCard'
import styles from './TaskList.module.scss'
import VSelect from '../../components/ui/VSelect/VSelect'
import { useFetching } from '../../hooks/useFetching'
import { useStores } from '../../store/rootStore'

const limit = 8 // количество заданий загружаемых за один запрос

const TaskList = (props) => {
  const { settingsStore } = useStores()
  const [taskList, setTaskList] = useState([]) // спсиок заданий
  const [currentPage, setCurrentPage] = useState(1) // последняя загруженная страница
  const [totalPages, setTotalPages] = useState(1) // всего страниц
  const lastElement = useRef() // элемент после листа, при отоброжении которго подгружаются новые посты
  const observer = useRef() // для слежки за видимостью элемента после листа
  const { loading, fetching } = useFetching() // обертка для отображения состояния загрузки данных с сервера

  // запрос списка заданий
  const getTasksFromServer = useCallback(
    async (page, sort) => {
      await fetching(async () => {
        await fetchAllTask(page, limit, sort)
          .then((data) => {
            setTaskList((taskList) => [...taskList, ...data.tasks])
            setTotalPages(data.totalPages)
          })
          .catch((error) => {
            setTotalPages(0) // если произошла ошибка, то сообщаем, что это последняя страница
            throw error
          })
      })
    },
    [fetching]
  )

  useEffect(() => {
    getTasksFromServer(currentPage, settingsStore.settings.taskSort)
  }, [currentPage, settingsStore.settings.taskSort, getTasksFromServer])

  // подгрузка постов при прокрутке страницы
  useEffect(() => {
    if (loading) return // если в состоянии загрузки, то выходим
    if (observer.current) observer.current.disconnect() // если observer за кем-то наблюдает, то отключаем наблюдение

    // когда видим указанный div то прибавляем страницу
    const callback = function (entries, observer) {
      if (entries[0].isIntersecting && currentPage < totalPages) {
        setCurrentPage((currentPage) => currentPage + 1)
      }
    }
    observer.current = new IntersectionObserver(callback)
    observer.current.observe(lastElement.current)
  }, [currentPage, totalPages, loading])

  // смена сортировки
  const SelectSort = (sort) => {
    settingsStore.setSettings('taskSort', sort)
    setCurrentPage(1)
    setTaskList([])
  }

  return (
    <div className={styles.container}>
      <div>
        <VSelect
          value={settingsStore.settings.taskSort || 'easyFirst'}
          onChange={(sort) => SelectSort(sort)}
          defaultValue="Сортировка"
          options={[
            { value: 'newFirst', name: 'Сначала новые' },
            { value: 'popularFirst', name: 'Сначала популярные' },
            { value: 'hardFirst', name: 'Cначала сложные' },
            { value: 'easyFirst', name: 'Сначала простые' },
            {
              value: 'highlyRatedFirst',
              name: 'Сначала с высоким рейтингом',
            },
            { value: 'lowRatedFirst', name: 'Сначала с низким рейтингом' },
          ]}
        />
      </div>
      <div className={styles.TaskList}>
        {taskList.length > 0
          ? taskList.map((element, i) => {
              return <TaskCard task={element} rootStyles={styles} key={i} />
            })
          : ''}
      </div>
      <div ref={lastElement}>{currentPage < totalPages ? <Loader /> : ''}</div>
    </div>
  )
}

export default observer(TaskList)
