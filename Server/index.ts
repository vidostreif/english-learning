require('dotenv').config() // инициализация переменных среды
import express from 'express'
import { sequelize, openConnection, closeConnection } from './db/' //для подключения к БД
import cookieParser from 'cookie-parser'
import cors from 'cors' // для обработки запросов с браузера
import fileUpload from 'express-fileupload'
import router from './routes/index' // список маршрутов
import errorHandler from './middleware/ErrorHandlingMiddleware'
import path from 'path'
import dbPreparation from './db/dbPreparation'
const PORT = process.env.PORT || 5000

const app = express()
app.use(cookieParser()) // для депарсинга cookie
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
) // для обработки запросов с браузера
app.use(express.json()) // для депарсинга json
app.use(express.static(path.resolve(__dirname, 'static'))) // для отправки файлов
app.use(fileUpload({})) // для получения файлов

app.use('/api', router)

app.use(errorHandler) //обработка ошибок

//Отдаем фронтэнд
if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, '../Client', 'build')))

  app.get('*', (req, res) => {
    //отдаем файл текущая_директория/client/build/index.html
    res.sendFile(path.resolve(__dirname, '../Client', 'build', 'index.html'))
  })
}

const start = async () => {
  try {
    await openConnection() //подключение к базе данных
    await sequelize
      .sync({ alter: true })
      .then(() => {
        console.log('Re-sync db.')
        dbPreparation()
        console.log('db Preparation.')
      })
      .catch((e) => {
        console.log('Error re-sync db: ' + e)
      }) //сверка состояния базы данных со схемой
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  } catch (e) {
    console.log(e)
  }
}

start()
