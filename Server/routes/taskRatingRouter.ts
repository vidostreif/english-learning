import Router from 'express'
const router = Router()
import taskRatingController from '../controllers/taskRatingController'
import ApiError from '../exceptions/ApiError'
import authMiddleware from '../middleware/authMiddleware'

router.post('/', authMiddleware.isAuthorized, ApiError.tryShell(taskRatingController.addUserTaskRating))
router.get('/', authMiddleware.isAuthorized, ApiError.tryShell(taskRatingController.getAllUserTaskRatings))
router.get('/:id', authMiddleware.isAuthorized, ApiError.tryShell(taskRatingController.getOneUserTaskRating))
router.delete('/', authMiddleware.isAuthorized, ApiError.tryShell(taskRatingController.removeUserTaskRating))

export default router
