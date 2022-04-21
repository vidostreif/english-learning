require('dotenv').config() // инициализация переменных среды
const express = require('express')
const { sequelize, openConnection, closeConnection } = require('./db') //для подключения к БД
const cookieParser = require('cookie-parser')
const cors = require('cors') // для обработки запросов с браузера
const fileUpload = require('express-fileupload')
const router = require('./routes/index') // список маршрутов
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const dbPreparation = require('./db/dbPreparation')
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
