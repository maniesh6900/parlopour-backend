import express from 'express';
import cookieParser from "cookie-parser";
const app = express();
import cors from "cors";

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin : "*"}));

import AdminRouter from "./router/admin-router";
import EmpRouter from "./router/emp-router";

app.use("/api/v1/admin", AdminRouter);
app.use("/api/v1/emp", EmpRouter);



export {app};