// import { User, TaskRating, Dictionary } from '../db/models'
import { v4 } from 'uuid'
import fs from 'fs'
import taskRatingService from './taskRatingService'
// import { Sequelize, Op, InferCreationAttributes, Optional } from 'sequelize'
import path from 'path'
import sharp from 'sharp'
import {
  prismaClient,
  Prisma,
  MarkersIncludeDictionary,
  TaskIncludeMarkersIncludeDictionary,
  taskIncludeMarkersIncludeDictionary,
} from '../prisma/prismaClient'

class TaskService {
  //добавление или обновление параметров задания
  async addOrUpdate(userId: number, taskId: number, complexity: number, markersStr: string, files: { img: File }) {
    const markers: Array<MarkersIncludeDictionary> = JSON.parse(markersStr)

    // получение картинки
    let img = null
    if (files) {
      img = files.img
    } else if (!taskId) {
      throw new Error('Попытка сохранения задания без картинки!')
    }

    let task: TaskIncludeMarkersIncludeDictionary = null
    //если есть id задачи, то ищем задачу в БД
    if (taskId) {
      // task = await Task.findOne({
      //   where: { id: taskId },
      // })
      task = await prismaClient.task.findFirst({
        where: { id: taskId },
        ...taskIncludeMarkersIncludeDictionary,
      })

      if (!task) {
        throw new Error(`Не удалось найти задание по ID ${taskId}`)
      }

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
      task = await prismaClient.task.create({
        data: { imgUrl: await this.saveImg(img), complexity },
        ...taskIncludeMarkersIncludeDictionary,
      })
      // если небыло id задания сохраняем первую оценку от автора задания
      taskRatingService.add(userId, task.id, 100)
    }

    //удаляем старые маркеры в БД
    // await Marker.destroy({
    //   where: {
    //     taskId: task.id,
    //   },
    // })

    await prismaClient.marker.deleteMany({
      where: {
        taskId: task.id,
      },
    })

    //Сохраняем маркеры в БД
    // const markersInDB = await Marker.bulkCreate(markers)
    // await task.setMarkers(markersInDB)

    // task = await prisma.task.update({
    //   where: { id: task.id },
    //   data: {
    //     ...task,
    //     // markers: {
    //     //   deleteMany: {},
    //     //   createMany: {
    //     //     data: markers,
    //     //   },
    //     // },
    //   },
    //   ...taskIncludeMarkersIncludeDictionary,
    // })

    taskId = task.id
    delete task.id
    delete task.markers

    //Сохраняем слова и привязываем их к маркерам
    for (let index = 0; index < markers.length; index++) {
      const name = markers[index].dictionary.name.trim().toLowerCase()

      await prismaClient.marker.create({
        data: {
          left: markers[index].left,
          top: markers[index].top,
          task: { connect: { id: taskId } },
          dictionary: {
            connectOrCreate: { where: { name }, create: { name } },
          },
        },
      })

      // let text = await Dictionary.findOne({
      //   where: { name: newText },
      // })

      // if (!text) {
      //   text = new Dictionary({
      //     name: newText,
      //   })
      //   await text.save()
      // }

      // await markersInDB[index].setDictionary(text)
    }

    return await prismaClient.task.update({
      where: { id: taskId },
      data: {
        ...task,
      },
      ...taskIncludeMarkersIncludeDictionary,
    })

    // const resu = await Task.scope('includeMarkers').findOne({
    //   where: { id: task.id },
    // })
  }

  // complexity- строка или массив строк со значение от 1 до 5
  // limit - выбираемое количество
  // page - запрашиваемая страница
  // sort - метод сортировки
  async getAll(limit: number, page: number, complexity: number | number[], sort: string) {
    limit = limit || 10
    page = page || 1
    const offset = limit * (page - 1)

    // let param = {
    //   offset,
    //   limit,
    //   order: [
    //     [Sequelize.literal('rating'), 'DESC'],
    //     ['id', 'DESC'],
    //   ],
    // }

    const filter: any = {}
    if (complexity) {
      filter.where = {
        // complexity: { in: complexity },
        complexity: Array.isArray(complexity) ? { in: complexity } : complexity,
      }
    }

    let order = { field: 'id', order: 'ASC' }
    if (sort) {
      switch (sort) {
        case 'newFirst':
          // param.order = [
          //   ['createdAt', 'DESC'],
          //   ['id', 'DESC'],
          // ]
          order = { field: `"task"."createdAt"`, order: 'DESC' }
          break
        case 'popularFirst':
          // param.order = [
          //   ['numberOfPasses', 'DESC'],
          //   ['id', 'DESC'],
          // ]
          order = { field: `"task"."numberOfPasses"`, order: 'DESC' }
          break
        case 'hardFirst':
          // param.order = [
          //   ['complexity', 'DESC'],
          //   ['id', 'DESC'],
          // ]
          order = { field: `"task"."complexity"`, order: 'DESC' }
          break
        case 'easyFirst':
          // param.order = [
          //   ['complexity', 'ASC'],
          //   ['id', 'ASC'],
          // ]
          order = { field: `"task"."complexity"`, order: 'ASC' }
          break
        case 'highlyRatedFirst':
          // param.order = [
          //   [Sequelize.literal('rating'), 'DESC'],
          //   ['id', 'DESC'],
          // ]
          order = { field: 'rating', order: 'DESC' }
          break
        case 'lowRatedFirst':
          // param.order = [
          //   [Sequelize.literal('rating'), 'ASC'],
          //   ['id', 'ASC'],
          // ]
          order = { field: 'rating', order: 'ASC' }
          break
        default:
        // throw new Error('Неудалось определить сортировку по значению: ' + sort)
      }
    }

    const resu: any = {}
    // resu.tasks = await Task.scope('includeRating').findAll({
    //   ...param,
    //   ...filter,
    // })

    // resu.count = await Task.count({
    //   ...filter,
    // })

    resu.count = await prismaClient.task.count({ ...filter })
    // resu.count = await prisma.task.count()

    resu.currentPage = page
    resu.totalPages = Math.ceil(resu.count / limit) // всего страниц

    //Подготавливаем данные для фильтрации в запросе
    let WHERE = ''
    if (filter.where) {
      let whereArr = []
      for (var key in filter.where) {
        // если фильтруем значениями из массива
        if (filter.where[key].in) {
          whereArr.push(key + ' in (' + filter.where[key].in.join(', ') + ')')
        } else {
          whereArr.push(key + '=' + filter.where[key])
        }
      }
      WHERE = 'WHERE ' + whereArr.join(' AND ')
    }

    resu.tasks = await prismaClient.$queryRawUnsafe(`SELECT "task"."id",
      "task"."imgUrl",
      "task"."numberOfPasses",
      "task"."complexity",
      "task"."createdAt",
      "task"."updatedAt",
      AVG("taskRatings"."rating") AS "rating"
      FROM "tasks" AS "task"
        LEFT OUTER JOIN "taskRatings" AS "taskRatings" ON "task"."id" = "taskRatings"."taskId" 
      ${WHERE}
      GROUP BY "task"."id"
      ORDER BY ${order.field} ${order.order}, "task"."id" ASC
      LIMIT ${limit} 
      OFFSET ${offset};`)

    return resu
  }

  async getOne(taskId: number) {
    if (!taskId) {
      throw new Error('Не задан ID')
    }

    // const resu = await Task.scope('includeMarkers').findOne({
    //   where: { id: taskId },
    // })

    const resu = await prismaClient.task.findFirst({
      where: {
        id: taskId,
      },
      include: { markers: { include: { dictionary: true } } },
      //   // select: {
      //   //   id: true,
      //   //   imgUrl: true,
      //   //   complexity: true,
      //   //   markers: {
      //   //     select: {
      //   //       id: true,
      //   //       top: true,
      //   //       left: true,
      //   //       dictionary: {
      //   //         select: {
      //   //           id: true,
      //   //           name: true,
      //   //         },
      //   //       },
      //   //     },
      //   //   },
    })

    return resu
  }

  async getRandom(count: any, not_id: any) {
    // let param = {
    //   order: Sequelize.literal('random()'),
    //   limit: count ? count : 1,
    //   where: {},
    // }

    const limit = count ? count : 1
    let WHERE = ''
    if (not_id) {
      // param.where = {
      //   id: {
      //     [Op.ne]: not_id,
      //   },
      // }
      WHERE = `WHERE "task"."id" != ${not_id}`
    }

    const resu = await prismaClient.$queryRawUnsafe(`
        SELECT 
          "task"."id",
          "task"."imgUrl",
          "task"."numberOfPasses",
          "task"."complexity",
          "task"."createdAt",
          "task"."updatedAt"
        FROM "tasks" AS "task"
        ${WHERE}
        ORDER BY random()
        LIMIT ${limit};`)

    return resu

    // return await Task.scope('includeMarkers').findAll({
    //   ...param,
    // })
  }

  // помечаем на удаление
  async destroyOne(taskId: number) {
    if (!taskId) {
      throw new Error('Не задан ID')
    }

    await prismaClient.task.update({
      where: {
        id: taskId,
      },
      data: {
        deleted: true,
      },
    })

    // await Task.destroy({
    //   where: { id: taskId },
    //   force,
    // })

    return 'Задание удалено'
  }

  // восстанавливает помеченное на удаление задание
  async restoreOne(taskId: number) {
    if (!taskId) {
      throw new Error('Не задан ID')
    }

    await prismaClient.task.update({
      where: {
        id: taskId,
      },
      data: {
        deleted: false,
      },
    })

    // await Task.restore({
    //   where: { id: taskId },
    // })

    return 'Задание восстановленно'
  }

  // увеличение счетчика прохождения задания
  async wasPassed(taskId: number) {
    if (!taskId) {
      throw new Error('Не задан ID задания')
    }

    prismaClient.task.update({ where: { id: taskId }, data: { numberOfPasses: { increment: 1 } } })
    // инкремент количества прохождений
    // await Task.increment({ numberOfPasses: 1 }, { where: { id: taskId } })

    return 'Количество прохождений увеличино'
  }

  // сохранение новой картинки
  async saveImg(img: { data: sharp.SharpOptions }) {
    const newUuid = v4()
    const fileName = newUuid + '.webp'
    const imgPath = path.resolve(__dirname, '..', 'static', fileName)
    const imgPathMini = path.resolve(__dirname, '..', 'static', 'mini_' + fileName)

    await sharp(img.data).toFile(imgPath)
    // сохраняем миниатюру
    await sharp(img.data).resize(350).toFile(imgPathMini)

    return fileName
  }

  // удаление старой картинки
  async delImg(imgName: string) {
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

export default new TaskService()
