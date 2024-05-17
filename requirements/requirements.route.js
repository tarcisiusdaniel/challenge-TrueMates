import { Router } from 'express';
import multer from 'multer';
import UsersController from './controllers/users.controller.js';
import AuthController from './controllers/auth.controller.js';
import PostsController from './controllers/posts.controller.js';

// Sequelize migrations are required for each database manipulation.

const router = Router();

// Configure multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }); 

router.route("/").get(UsersController.apiRootRouter);
router.route("/users/get/all").get(UsersController.apiGetAllUsers);

// user-related: login and register
router.route("/users/login").get(UsersController.apiGetSpecificUser);
router.route("/users/register").post(UsersController.apiRegisterUser);

// post related
// router.route("/protected").get(AuthController.verifyToken, PostsController.apiDoSmthProtected);
router.route("/posts/user/create").post(AuthController.verifyToken, upload.array('photos', 10), PostsController.apiCreatePost);
router.route("/posts/get/post/:postId").get(AuthController.verifyToken, PostsController.apiGetPost);
router.route("/posts/update/post/description/:postId").put(AuthController.verifyToken, PostsController.apiUpdatePostDescription);

export default router;