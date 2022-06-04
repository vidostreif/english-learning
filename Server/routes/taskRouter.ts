import Router from 'express'
const router = Router()
import taskController from '../controllers/taskController'
import ApiError from '../exceptions/ApiError'
import authMiddleware from '../middleware/authMiddleware'

router.post('/', authMiddleware.isAuthorized, authMiddleware.isAdministarator, ApiError.tryShell(taskController.addOrUpdate))
router.post('/restore/:id', authMiddleware.isAuthorized, authMiddleware.isAdministarator, ApiError.tryShell(taskController.restoreOne))
router.post('/passed/:id', ApiError.tryShell(taskController.wasPassed))
router.get('/', ApiError.tryShell(taskController.getAll))
router.get('/random', ApiError.tryShell(taskController.getRandom))
router.get('/:id', ApiError.tryShell(taskController.getOne))
router.delete('/', authMiddleware.isAuthorized, authMiddleware.isAdministarator, ApiError.tryShell(taskController.destroyOne))

export default router
