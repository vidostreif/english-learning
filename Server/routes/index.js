const Router = require('express')
const router = new Router()
const taskRouter = require('./taskRouter')
const userRouter = require('./userRouter')
const dictionaryRouter = require('./dictionaryRouter')

router.use('/task', taskRouter)
router.use('/user', userRouter)
router.use('/dictionary', dictionaryRouter)

module.exports = router
