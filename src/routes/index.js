const Router = require('express')
const userController = require('../controller/userController')
const postController = require('../controller/postController')

const router = Router()

router.get(("/users"), userController.getAllUsers)
router.get(("/user/:id"), userController.findUserById)
router.post(("/user"), userController.createUser)
router.post(("/user-posts"), userController.createUserWithPosts)
router.put(("/user/:id"), userController.updateUser)
router.delete(("/user/:id"), userController.deleteUser)

router.get(("/posts"), postController.getAllPosts)
router.get(("/posts/user/:userId"), postController.getPostsByUser)
router.post(("/post"), postController.createPost)
router.put(("/post/:id"), postController.updatePost)
router.delete(("/post/:id"), postController.deletePost)

module.exports = router