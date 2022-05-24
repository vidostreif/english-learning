const Router = require('express')
const router = new Router()
const dictionaryController = require('../controllers/dictionaryController')
const ApiError = require('../exceptions/ApiError')

router.post('/', ApiError.tryShell(dictionaryController.create))
router.get('/', ApiError.tryShell(dictionaryController.getAll))
router.get('/:id', ApiError.tryShell(dictionaryController.getOne))
router.delete('/', ApiError.tryShell(dictionaryController.delete))

module.exports = router
