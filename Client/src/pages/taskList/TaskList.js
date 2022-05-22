import React, { useState, useEffect, useRef } from 'react'
import { fetchAllTask } from '../../services/taskService'
import Loader from '../../components/loader/Loader.js'
import TaskCard from '../../components/taskCard/TaskCard'
import styles from './TaskList.module.scss'
import VSelect from '../../components/ui/VSelect/VSelect'
import { useFetching } from '../../hooks/useFetching'

const limit = 8

const TaskList = (props) => {
  const [taskList, setTaskList] = useState([]) // спсиок заданий
  const [currentPage, setCurrentPage] = useState(1) // последняя загруженная страница
  const [totalPages, setTotalPages] = useState(Infinity) // загружена последняя страница заданий
  const [selectedSort, setSelectedSort] = useState('') // выбранный метод сортировки
  const lastElement = useRef() // последний элемент массива
  const observer = useRef() // для слежки за видимостью последнего элемента
  const { loading, fetching } = useFetching() // обертка для отображения состояния загрузки данных с сервера

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
  }, [loading])

  useEffect(() => {
    getTasksFromServer(currentPage, selectedSort)
  }, [currentPage])

  // запрос списка заданий
  const getTasksFromServer = (page, sort) => {
    fetching(async () => {
      await fetchAllTask(page, limit, 'highlyRatedFirst')
        .then((data) => {
          setTaskList((taskList) => [...taskList, ...data.tasks])
          setTotalPages(data.totalPages)
        })
        .catch(() => {
          setTotalPages(0) // если произошла ошибка, то сообщаем, что это последняя страница
        })
    })
  }

  // const sortTasks = (sort) => {
  //   setSelectedSort(sort)
  // }

  return (
    <div className={styles.container}>
      <div>
        <VSelect
          value={selectedSort}
          onChange={(sort) => setSelectedSort(sort)}
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
      <div ref={lastElement}>{loading ? <Loader /> : ''}</div>
    </div>
  )
}

export default TaskList
