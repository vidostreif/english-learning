const Router = require('express')
const router = new Router()
const taskRouter = require('./taskRouter')
const taskRatingRouter = require('./taskRatingRouter')
const userRouter = require('./userRouter')
const dictionaryRouter = require('./dictionaryRouter')

router.use('/task', taskRouter)
router.use('/task_rating', taskRatingRouter)
router.use('/user', userRouter)
router.use('/dictionary', dictionaryRouter)

module.exports = router
