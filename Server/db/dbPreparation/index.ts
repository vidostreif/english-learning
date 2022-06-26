// import { UserRole, TaskRating, User, Task, Dictionary, Marker, Token } from '../models'
// import sharp from 'sharp'
// import uuid from 'uuid'
// import fs from 'fs'
// import path from 'path'

//функция предварительного заполнения БД
// export default async function dbPreparation() {
//   await UserRole.findOrCreate({ where: { name: 'user' } })
//   await UserRole.findOrCreate({ where: { name: 'administrator' } })

//   // const userRole: UserRole = await UserRole.findOne({ where: { id: 1 } })

//   // const token: Token = await Token.findOne({ where: { id: 97 } })
//   // const us = await token.getUser()

//   // console.log(us.email)

//   // const user: User = await User.scope('role').findOne({ where: { id: 28 } })

//   // console.log(user.userRoleId)

//   // dict.getMarkers()

//   //!!! Убрать
//   //Пересохраняем все картинки в новом формате
//   // const tasks = await Task.findAll()

//   // for (const task of tasks) {
//   //   if (task.imgUrl.indexOf('webp') < 0) {
//   //     task.imgUrl = await saveImg(task.imgUrl)
//   //     await task.save()
//   //   }
//   // }

//   // //Удаляем все не нужные картинки
//   // const tasks2 = await Task.findAll()

//   // fs.readdir(path.resolve(__dirname, '../..', 'static'), (err, files) => {
//   //   files.forEach((file) => {
//   //     let del = true
//   //     tasks2.forEach(async (task) => {
//   //       if (file.indexOf(task.imgUrl) > -1) {
//   //         del = false
//   //       }
//   //     })

//   //     if (del) {
//   //       fs.unlinkSync(
//   //         path.resolve(__dirname, '../..', 'static', file),
//   //         (err) => {
//   //           if (err) throw err
//   //         }
//   //       )

//   //       console.log(file)
//   //     }
//   //   })
//   // })
// }

// const saveImg = async (oldfileName) => {
//   const newUuid = uuid.v4()
//   const fileName = newUuid + '.webp'
//   const oldImgPath = path.resolve(__dirname, '../..', 'static', oldfileName)
//   const imgPath = path.resolve(__dirname, '../..', 'static', fileName)
//   const imgPathMini = path.resolve(
//     __dirname,
//     '../..',
//     'static',
//     'mini_' + fileName
//   )
//   // img.mv(imgPath)

//   await sharp(oldImgPath).toFile(imgPath)
//   // сохраняем миниатюру
//   await sharp(oldImgPath).resize(350).toFile(imgPathMini)

//   fs.unlinkSync(
//     path.resolve(__dirname, '../..', 'static', oldfileName),
//     (err) => {
//       if (err) throw err
//     }
//   )

//   return fileName
// }
