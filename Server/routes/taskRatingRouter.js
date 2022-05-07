const Router = require('express')
const router = new Router()
const taskRatingController = require('../controllers/taskRatingController')
const authMiddleware = require('../middleware/authMiddleware')

router.post('/', authMiddleware, taskRatingController.addUserTaskRating)
router.get('/', authMiddleware, taskRatingController.getAllUserTaskRatings)
router.get('/:id', authMiddleware, taskRatingController.getOneUserTaskRating)
router.delete('/', authMiddleware, taskRatingController.removeUserTaskRating)

module.exports = router
