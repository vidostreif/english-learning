const { User, Task, TaskRating, Marker, Dictionary } = require('../db/models')
const uuid = require('uuid')
const fs = require('fs')
const taskRatingService = require('./taskRatingService')
const { Sequelize } = require('sequelize')
const path = require('path')
const sharp = require('sharp')

class TaskService {
  //добавление или обновление параметров задания
  async addOrUpdate(userId, taskId, complexity, markers, files) {
    taskId = JSON.parse(taskId)
    markers = JSON.parse(markers)
    complexity = Number.parseInt(JSON.parse(complexity))

    // получение картинки
    let img = null
    if (files) {
      img = files.img
    } else if (!taskId) {
      throw new Error('Попытка сохранения задания без картинки!')
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
        this.delImg(task.imgUrl)

        //И сохраняем новую картинку
        // const fileName = uuid.v4() + '.jpg'
        // img.mv(path.resolve(__dirname, '..', 'static', fileName))
        task.imgUrl = await this.saveImg(img)
      }
    } //Если нет id задачи то создаем новую задачу
    else {
      // const fileName = uuid.v4() + '.jpg'
      // img.mv(path.resolve(__dirname, '..', 'static', fileName))

      task = new Task({ imgUrl: await this.saveImg(img), complexity })
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
      throw new Error('Не задан ID задания')
    }

    // инкремент количества прохождений
    await Task.increment({ numberOfPasses: 1 }, { where: { id: taskId } })

    return 'Количество прохождений увеличино'
  }

  // сохранение новой картинки
  async saveImg(img) {
    const newUuid = uuid.v4()
    const fileName = newUuid + '.webp'
    const imgPath = path.resolve(__dirname, '..', 'static', fileName)
    const imgPathMini = path.resolve(
      __dirname,
      '..',
      'static',
      'mini_' + fileName
    )

    await sharp(img.data).toFile(imgPath)
    // сохраняем миниатюру
    await sharp(img.data).resize(350).toFile(imgPathMini)

    return fileName
  }

  // удаление старой картинки
  async delImg(imgName) {
    const dirPath = path.resolve(__dirname, '..', 'static')
    // основную
    fs.unlink(path.resolve(dirPath, imgName), (err) => {
      if (err) throw err
    })
    // миниатюру
    fs.unlink(path.resolve(dirPath, 'mini_' + imgName), (err) => {
      if (err) throw err
    })
  }
}

module.exports = new TaskService()
