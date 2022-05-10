const Router = require('express')
const router = new Router()
const taskRatingController = require('../controllers/taskRatingController')
const authMiddleware = require('../middleware/authMiddleware')

router.post(
  '/',
  authMiddleware.isAuthorized,
  taskRatingController.addUserTaskRating
)
router.get(
  '/',
  authMiddleware.isAuthorized,
  taskRatingController.getAllUserTaskRatings
)
router.get(
  '/:id',
  authMiddleware.isAuthorized,
  taskRatingController.getOneUserTaskRating
)
router.delete(
  '/',
  authMiddleware.isAuthorized,
  taskRatingController.removeUserTaskRating
)

module.exports = router
