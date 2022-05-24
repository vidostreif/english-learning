const Router = require('express')
const router = new Router()
const taskRatingController = require('../controllers/taskRatingController')
const ApiError = require('../exceptions/ApiError')
const authMiddleware = require('../middleware/authMiddleware')

router.post(
  '/',
  authMiddleware.isAuthorized,
  ApiError.tryShell(taskRatingController.addUserTaskRating)
)
router.get(
  '/',
  authMiddleware.isAuthorized,
  ApiError.tryShell(taskRatingController.getAllUserTaskRatings)
)
router.get(
  '/:id',
  authMiddleware.isAuthorized,
  ApiError.tryShell(taskRatingController.getOneUserTaskRating)
)
router.delete(
  '/',
  authMiddleware.isAuthorized,
  ApiError.tryShell(taskRatingController.removeUserTaskRating)
)

module.exports = router
