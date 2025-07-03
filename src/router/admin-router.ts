import { Router } from "express";
import { AdminLogin, Adminsingup, CreateTask, DeleteTask, EditTask, GetTask } from "../controller/admin-controller";
import { AdminMiddleware  }from "../middeware/adminMiddle";
const router = Router();

router.route("/login").post(AdminLogin);
router.route("/signup").post(Adminsingup);
router.route("/task/create").post(AdminMiddleware, CreateTask);
router.route("/tasks").get(AdminMiddleware, GetTask);
router.route("/task/delete").post(AdminMiddleware, DeleteTask);
router.route("/task/update").post(AdminMiddleware, EditTask);


export default router;