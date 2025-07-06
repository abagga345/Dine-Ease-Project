import express from "express"
import {userRouter} from "./user/userroutes"
import {adminRouter} from "./admin/adminroutes"
import {metricsRouter} from "./metrics/metrics"

export const mainRouter=express.Router();

mainRouter.use("/user",userRouter);

mainRouter.use("/admin",adminRouter);

mainRouter.use("/data",metricsRouter);