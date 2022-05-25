const { UserRole, TaskRating, User, Task } = require('../models')
const sharp = require('sharp')
const uuid = require('uuid')
const fs = require('fs')
const path = require('path')

//функция предварительного заполнения БД
module.exports = async function dbPreparation(params) {
  await UserRole.findOrCreate({ where: { name: 'user' } })
  await UserRole.findOrCreate({ where: { name: 'administrator' } })

  //!!! Убрать
  //Пересохраняем все картинки в новом формате
  const tasks = await Task.findAll()

  tasks.forEach(async (task) => {
    if (task.imgUrl.indexOf('webp') < 0) {
      task.imgUrl = await saveImg(task.imgUrl)
      await task.save()
    }
  })

  //Удаляем все не нужные картинки
  const tasks2 = await Task.findAll()

  fs.readdir(path.resolve(__dirname, '../..', 'static'), (err, files) => {
    files.forEach((file) => {
      let del = true
      tasks2.forEach(async (task) => {
        if (task.imgUrl === file || 'mini_' + task.imgUrl === file) {
          del = false
        }
      })

      if (del) {
        fs.unlink(path.resolve(__dirname, '../..', 'static', file), (err) => {
          if (err) throw err
        })

        console.log(file)
      }
    })
  })
}

const saveImg = async (oldfileName) => {
  const newUuid = uuid.v4()
  const fileName = newUuid + '.webp'
  const oldImgPath = path.resolve(__dirname, '../..', 'static', oldfileName)
  const imgPath = path.resolve(__dirname, '../..', 'static', fileName)
  const imgPathMini = path.resolve(
    __dirname,
    '../..',
    'static',
    'mini_' + fileName
  )
  // img.mv(imgPath)

  await sharp(oldImgPath).toFile(imgPath)
  // сохраняем миниатюру
  await sharp(oldImgPath).resize(350).toFile(imgPathMini)

  fs.unlink(path.resolve(__dirname, '../..', 'static', oldfileName), (err) => {
    if (err) throw err
  })

  return fileName
}
