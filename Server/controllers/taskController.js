const { Task, Marker, Dictionary } = require('../db/models')
const { Sequelize, Op } = require('sequelize')
const taskService = require('../services/taskService')

class TaskController {
  async addOrUpdate(req, res, next) {
    const userId = req.user.id
    const { complexity, markers, id } = req.body
    const files = req.files

    res.json(
      await taskService.addOrUpdate(userId, id, complexity, markers, files)
    )
  }

  async destroyOne(req, res, next) {
    const { id } = req.params

    res.json(await taskService.destroyOne(id))
  }

  async restoreOne(req, res, next) {
    const { id } = req.params

    res.json(await taskService.restoreOne(id))
  }

  async getAll(req, res, next) {
    let { limit, page, complexity, sort } = req.query

    res.json(await taskService.getAll(limit, page, complexity, sort))
  }

  async getOne(req, res, next) {
    const { id } = req.params

    res.json(await taskService.getOne(id))
  }

  async getRandom(req, res, next) {
    const { not_id, count } = req.query

    res.json(await taskService.getRandom(count, not_id))
  }

  // увеличение счетчика прохождения задания
  async wasPassed(req, res, next) {
    const { id } = req.params

    res.json(await taskService.wasPassed(id))
  }
}

module.exports = new TaskController()
