require('dotenv').config() // инициализация переменных среды
import express from 'express'
import cluster from 'cluster'
import { sequelize, openConnection, closeConnection } from './db/' //для подключения к БД
import cookieParser from 'cookie-parser'
import cors from 'cors' // для обработки запросов с браузера
import fileUpload from 'express-fileupload'
import router from './routes/index' // список маршрутов
import errorHandler from './middleware/ErrorHandlingMiddleware'
import path from 'path'
// import dbPreparation from './db/dbPreparation'
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

const totalCPUs = require('os').cpus().length

const start = async () => {
  try {
    await openConnection() //подключение к базе данных
    if (cluster.isPrimary) {
      console.log(`Number of CPUs is ${totalCPUs}`)
      console.log(`Master ${process.pid} is running`)

      // await sequelize
      //   //сверка состояния базы данных со схемой
      //   .sync({ alter: true })
      //   //подготовка данных в БД
      //   .then(() => {
      //     console.log('Re-sync db.')
      //     dbPreparation()
      //     console.log('db Preparation.')
      //   })
      //   .catch((e) => {
      //     console.log('Error re-sync db: ' + e)
      //   })

      if (totalCPUs === 1 || process.env.NODE_ENV === 'development') {
        // если ядро только одно, то запускаем прослушивание в главном процессе
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
      } else {
        // иначе запускаем форки в количестве равное количеству ядер - 1
        for (let i = 0; i < totalCPUs - 1; i++) {
          cluster.fork()
        }
      }

      cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`)
        console.log("Let's fork another worker!")
        cluster.fork()
      })
    } else {
      app.listen(PORT, () => console.log(`Worker ${cluster.worker.id} launched on port ${PORT}`))
    }
  } catch (e) {
    console.log(e)
  }
}

start()
