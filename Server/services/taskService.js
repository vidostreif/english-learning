const { User, Task, TaskRating, Marker, Dictionary } = require('../db/models')
const uuid = require('uuid')
const fs = require('fs')
const taskRatingService = require('./taskRatingService')
const { Sequelize, Op } = require('sequelize')
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
        task.imgUrl = await this.saveImg(img)
      }
    } //Если нет id задачи то создаем новую задачу
    else {
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

  // complexity- строка или массив строк со значение от 1 до 5
  // limit - выбираемое количество
  // page - запрашиваемая страница
  // sort - метод сортировки
  async getAll(limit, page, complexity, sort) {
    limit = parseInt(JSON.parse(limit || 10))
    page = parseInt(JSON.parse(page || 1))

    let param = {
      offset: limit * (page - 1),
      limit,
    }
    const filter = {}
    if (complexity) {
      complexity = parseInt(JSON.parse(complexity))
      filter.where = {
        complexity,
      }
    }

    if (sort) {
      switch (sort) {
        case 'newFirst':
          param.order = [
            ['createdAt', 'DESC'],
            ['id', 'DESC'],
          ]
          break
        case 'popularFirst':
          param.order = [
            ['numberOfPasses', 'DESC'],
            ['id', 'DESC'],
          ]
          break
        case 'hardFirst':
          param.order = [
            ['complexity', 'DESC'],
            ['id', 'DESC'],
          ]
          break
        case 'easyFirst':
          param.order = [
            ['complexity', 'ASC'],
            ['id', 'ASC'],
          ]
          break
        case 'highlyRatedFirst':
          param.order = [
            [Sequelize.literal('rating'), 'DESC'],
            ['id', 'DESC'],
          ]
          break
        case 'lowRatedFirst':
          param.order = [
            [Sequelize.literal('rating'), 'ASC'],
            ['id', 'ASC'],
          ]
          break
        default:
          throw new Error('Неудалось определить сортировку по значению: ' + sort)
      }
    }

    const resu = {}
    resu.tasks = await Task.scope('includeRating').findAll({
      ...param,
      ...filter,
    })

    resu.count = await Task.count({
      ...filter,
    })

    resu.currentPage = page
    resu.totalPages = Math.ceil(resu.count / limit) // всего страниц

    return resu
  }

  async getOne(taskId) {
    if (!taskId) {
      throw new Error('Не задан ID')
    }

    const resu = await Task.scope('includeMarkers').findOne({
      where: { id: taskId },
    })

    return resu.dataValues
  }

  async getRandom(count, not_id) {
    let param = {
      order: Sequelize.literal('random()'),
      limit: count ? count : 1,
    }
    if (not_id) {
      param.where = {
        id: {
          [Op.ne]: not_id,
        },
      }
    }

    return await Task.scope('includeMarkers').findAll({
      ...param,
    })
  }

  // force - если true, то полностью удаляемтся из БД
  //         если false, то не удаляется из БД, а в поле deletedAt устанавливается время удаления
  async destroyOne(taskId, force = false) {
    if (!taskId) {
      throw new Error('Не задан ID')
    }

    await Task.destroy({
      where: { id: taskId },
      force,
    })

    return 'Задание удалено'
  }

  // восстанавливает помеченное на удаление задание
  async restoreOne(taskId) {
    if (!taskId) {
      throw new Error('Не задан ID')
    }

    await Task.restore({
      where: { id: taskId },
      force,
    })

    return 'Задание удалено'
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
    const imgPathMini = path.resolve(__dirname, '..', 'static', 'mini_' + fileName)

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
