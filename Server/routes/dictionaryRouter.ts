import Router from 'express'
const router = Router()
import dictionaryController from '../controllers/dictionaryController'
import ApiError from '../exceptions/ApiError'

router.post('/', ApiError.tryShell(dictionaryController.create))
router.get('/', ApiError.tryShell(dictionaryController.getAll))
router.get('/:id', ApiError.tryShell(dictionaryController.getOne))
router.delete('/', ApiError.tryShell(dictionaryController.delete))

export default router
