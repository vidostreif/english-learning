const Router = require('express')
const router = new Router()
const userController = require('../controllers/userController')
const { body } = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const ApiError = require('../exceptions/ApiError')

router.post(
  '/registration',
  body('email').isEmail(), //валидация почты
  body('password')
    .isString()
    .isLength({ min: 8, max: 32 })
    .not()
    .isLowercase()
    .not()
    .isUppercase()
    .not()
    .isNumeric()
    .not()
    .isAlpha(), //валидация пароля
  ApiError.tryShell(userController.registration)
)
router.post('/login', ApiError.tryShell(userController.login))
router.post('/logout', ApiError.tryShell(userController.logout))
router.get('/activate/:link', ApiError.tryShell(userController.activate))
router.get('/refresh', ApiError.tryShell(userController.refresh))
router.get(
  '/users',
  authMiddleware.isAuthorized,
  authMiddleware.isAdministarator,
  ApiError.tryShell(userController.getUsers)
)

module.exports = router
