import { Router } from "express";
import { EmpGetTasks, EmpLogin, Empsingup } from "../controller/emp-controller";
import { empMiddleware } from "../middeware/empMiddleware";
const router =  Router();

router.route("/login").post(EmpLogin);
router.route("/signup").post(Empsingup);
router.route("/tasks").get(empMiddleware , EmpGetTasks);


export default router;