import { Router } from 'express';
import Req1Controller from './controllers/req1.controller.js';

const router = Router();

router.route("/").get(Req1Controller.apiRootRouter);
router.route("/users/get/all").get(Req1Controller.apiGetAllUsers);
router.route("/users/get/specific").get(Req1Controller.apiGetSpecificUser);
router.route("/users/register").post(Req1Controller.apiRegisterUser);

export default router;