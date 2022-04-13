const Router = require('express')
const router = new Router()
const taskController = require('../controllers/taskController')

router.post('/', taskController.create)
router.get('/', taskController.getAll)
router.get('/random', taskController.getRandom)
router.get('/:id', taskController.getOne)
router.delete('/', taskController.delete)

module.exports = router
