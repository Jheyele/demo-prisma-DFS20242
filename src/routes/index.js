const Router = require('express')
const userController = require('../controller/userController')
const postController = require('../controller/postController')
const authController = require('../controller/authController')
const authenticate = require('../middlewares/authenticate')
const authorization = require('../middlewares/authorization')

const router = Router()

router.get(("/users"), authenticate, userController.getAllUsers)
router.get(("/user/:id"), userController.findUserById)
router.post(("/user"), userController.createUser)
router.post(("/user-posts"), userController.createUserWithPosts)
router.put(("/user/:id"), userController.updateUser)
router.delete(("/user/:userId"), authorization, userController.deleteUser)

router.get(("/posts"), postController.getAllPosts)
router.get(("/posts/user/:userId"), postController.getPostsByUser)
router.post(("/post"), authenticate, postController.createPost)
router.put(("/post/:id"), postController.updatePost)
router.delete(("/post/:id"), postController.deletePost)

router.post(("/login"), authController.login)

module.exports = router