const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController')
const authMiddleware = require('../middleware/authMiddleware')

router.post(
  '/',
  authMiddleware.isAuthorized,
  authMiddleware.isAdministarator,
  taskController.create
)
router.get('/', taskController.getAll)
router.get('/random', taskController.getRandom)
router.get('/:id', taskController.getOne)
router.delete(
  '/',
  authMiddleware.isAuthorized,
  authMiddleware.isAdministarator,
  taskController.delete
)

module.exports = router
