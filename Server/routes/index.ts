import Router from 'express'
const router = Router()
import taskRouter from './taskRouter'
import taskRatingRouter from './taskRatingRouter'
import userRouter from './userRouter'
import dictionaryRouter from './dictionaryRouter'

router.use('/task', taskRouter)
router.use('/task_rating', taskRatingRouter)
router.use('/user', userRouter)
router.use('/dictionary', dictionaryRouter)

export default router
