const { Task, Marker, Dictionary } = require('../db/models')
const { Sequelize, Op } = require('sequelize')
const taskService = require('../services/taskService')

class TaskController {
  async addOrUpdate(req, res, next) {
    const userId = req.user.id
    let { complexity, markers, id } = req.body

    res.json(await taskService.addOrUpdate(userId, id, complexity, markers))
  }

  async delete(req, res) {
    res.json({ message: 'Нужно реализовать TaskController!' })
  }

  async getAll(req, res) {
    // complexity- строка или массив строк со значение от 1 до 5
    // limit - выбираемое количество
    // page - запрашиваемая страница
    let { limit = 10, page = 1, complexity, sort } = req.query

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

    if (sort) {
      switch (sort) {
        case 'newFirst':
          param.order = [['createdAt', 'DESC']]
          break
        case 'popularFirst':
          param.order = [['numberOfPasses', 'DESC']]
          break
        case 'hardFirst':
          param.order = [['complexity', 'DESC']]
          break
        case 'easyFirst':
          param.order = [['complexity', 'ASC']]
          break
        case 'highlyRatedFirst':
          param.order = [[Sequelize.literal('rating'), 'DESC']]
          break
        case 'lowRatedFirst':
          param.order = [[Sequelize.literal('rating'), 'ASC']]
          break
        default:
          throw new Error(
            'Неудалось определить сортировку по значению: ' + sort
          )
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

  async getOne(req, res, next) {
    const { id } = req.params
    if (!id) {
      throw new Error('Не задан ID')
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

  // увеличение счетчика прохождения задания
  async wasPassed(req, res) {
    const { id } = req.params

    res.json(await taskService.wasPassed(id))
  }
}

module.exports = new TaskController()
