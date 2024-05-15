import { Router } from 'express';
import UsersController from './controllers/users.controller.js';
import AuthController from './controllers/auth.controller.js';
import PostsController from './controllers/posts.controller.js';

const router = Router();

router.route("/").get(UsersController.apiRootRouter);
router.route("/users/get/all").get(UsersController.apiGetAllUsers);

// user-related: login and register
router.route("/users/login").get(UsersController.apiGetSpecificUser);
router.route("/users/register").post(UsersController.apiRegisterUser);

// post related
// router.route("/protected").get(AuthController.verifyToken, PostsController.apiDoSmthProtected);
router.route("/posts/create/user").post(AuthController.verifyToken, PostsController.apiCreatePost);
router.route("/posts/get/post/:postId").post(AuthController.verifyToken, PostsController.apiGetPost);
router.route("/posts/update/post/:postId").post(AuthController.verifyToken, PostsController.apiUpdatePostDescription);

export default router;