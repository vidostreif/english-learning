const { User, Task, TaskRating, Marker } = require('../db/models')
const uuid = require('uuid')
const fs = require('fs')
const ApiError = require('../exceptions/ApiError')
const taskRatingService = require('./taskRatingService')
const { Sequelize } = require('sequelize')

class TaskService {
  //добавление или обновление параметров задания
  async addOrUpdate(userId, taskId, complexity, markers) {
    taskId = JSON.parse(taskId)
    markers = JSON.parse(markers)
    complexity = Number.parseInt(JSON.parse(complexity))

    // получение картинки
    let img = null
    if (req.files) {
      img = req.files.img
    } else if (!taskId) {
      throw 'Попытка сохранения задания без картинки!'
    }

    let task = null
    //если есть id задачи, то ищем задачу в БД
    if (taskId) {
      task = await Task.findOne({
        where: { id: taskId },
      })
      task.complexity = complexity

      if (img && task.imgUrl !== img.name) {
        //Если названия картинок не совпадают, то
        //Удаляем старую картинку
        fs.unlink(
          path.resolve(__dirname, '..', 'static', task.imgUrl),
          (err) => {
            if (err) throw err
          }
        )

        //И сохраняем новую картинку
        let fileName = uuid.v4() + '.jpg'
        img.mv(path.resolve(__dirname, '..', 'static', fileName))
        task.imgUrl = fileName
      }
    } //Если нет id задачи то создаем новую задачу
    else {
      let fileName = uuid.v4() + '.jpg'
      img.mv(path.resolve(__dirname, '..', 'static', fileName))

      task = new Task({ imgUrl: fileName, complexity })
    }

    await task.save()

    // если небыло id задания сохраняем первую оценку от автора задания
    if (!taskId) {
      taskRatingService.add(userId, task.id, 100)
    }

    //удаляем старые маркеры в БД
    await Marker.destroy({
      where: {
        taskId: task.id,
      },
    })

    //Сохраняем маркеры в БД
    const markersInDB = await Marker.bulkCreate(markers)
    await task.setMarkers(markersInDB)

    //Сохраняем слова и привязываем их к маркерам
    for (let index = 0; index < markers.length; index++) {
      const newText = markers[index].text.trim().toLowerCase()

      let text = await Dictionary.findOne({
        where: { name: newText },
      })

      if (!text) {
        text = new Dictionary({
          name: newText,
        })
        await text.save()
      }

      await markersInDB[index].setDictionary(text)
    }

    const resu = await Task.scope('includeMarkers').findOne({
      where: { id: task.id },
    })

    return resu
  }

  // увеличение счетчика прохождения задания
  async wasPassed(taskId) {
    if (!taskId) {
      throw 'Не задан ID задания'
    }

    // инкремент количества прохождений
    await Task.increment({ numberOfPasses: 1 }, { where: { id: taskId } })

    return 'Количество прохождений увеличино'
  }
}

module.exports = new TaskService()
