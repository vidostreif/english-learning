const { Task, Marker, Dictionary, TaskRating } = require('../db/models')
const { Sequelize, Op } = require('sequelize')
const ApiError = require('../exceptions/ApiError')
const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
const { log } = require('console')

class TaskController {
  async create(req, res, next) {
    try {
      let { complexity, markers, id } = req.body
      id = JSON.parse(id)
      markers = JSON.parse(markers)
      complexity = Number.parseInt(JSON.parse(complexity))

      let img = null
      if (req.files) {
        img = req.files.img
      } else if (!id) {
        throw 'Попытка сохранения задания без картинки!'
      }

      let task = null
      if (id) {
        //если есть id задачи, то ищем задачу в БД
        task = await Task.findOne({
          where: { id: id },
        })
        task.complexity = complexity

        if (img && task.imgUrl !== img.name) {
          //Если названия картинок не совпадают, то
          //Удаляем старую картинку
          // console.log(path.resolve(__dirname, '..', 'static', task.imgUrl))
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
      } else {
        //Если нет id задачи то создаем новую
        let fileName = uuid.v4() + '.jpg'
        img.mv(path.resolve(__dirname, '..', 'static', fileName))

        task = new Task({ imgUrl: fileName, complexity })
      }

      await task.save()

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

      res.json(resu)
    } catch (error) {
      next(ApiError.badRequest(error.message))
    }
  }

  async delete(req, res) {
    res.json({ message: 'Нужно реализовать TaskController!' })
  }

  async getAll(req, res) {
    // complexity- строка или массив строк со значение от 1 до 5
    // limit - выбираемое количество
    // page - запрашиваемая страница
    let { limit = 10, page = 1, complexity } = req.query

    console.log(limit, page, complexity)
    limit = parseInt(JSON.parse(limit))
    page = parseInt(JSON.parse(page))

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
    res.json(resu)
  }

  async getOne(req, res) {
    const { id } = req.params
    if (!id) {
      next(ApiError.badRequest('Не задан ID'))
    }
    const resu = await Task.scope('includeMarkers').findOne({
      where: { id: id },
    })
    res.json(resu.dataValues)
  }

  async getRandom(req, res) {
    const { not_id, count } = req.query

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

    const resu = await Task.scope('includeMarkers').findAll({
      ...param,
    })
    res.json(resu)
  }
}

module.exports = new TaskController()
