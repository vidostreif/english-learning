const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController')
const ApiError = require('../exceptions/ApiError')
const authMiddleware = require('../middleware/authMiddleware')

router.post(
  '/',
  authMiddleware.isAuthorized,
  authMiddleware.isAdministarator,
  ApiError.tryShell(taskController.addOrUpdate)
)
router.post('/passed/:id', ApiError.tryShell(taskController.wasPassed))
router.get('/', ApiError.tryShell(taskController.getAll))
router.get('/random', ApiError.tryShell(taskController.getRandom))
router.get('/:id', ApiError.tryShell(taskController.getOne))
router.delete(
  '/',
  authMiddleware.isAuthorized,
  authMiddleware.isAdministarator,
  ApiError.tryShell(taskController.delete)
)

module.exports = router
