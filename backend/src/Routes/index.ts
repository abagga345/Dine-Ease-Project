import express from "express"
import {userRouter} from "./user/userroutes"
import {adminRouter} from "./admin/adminroutes"
import {metricsRouter} from "./metrics/metrics"
import {paymentRouter} from "./payment/paymentroutes"

export const mainRouter=express.Router();

mainRouter.use("/user",userRouter);

mainRouter.use("/admin",adminRouter);

mainRouter.use("/data",metricsRouter);

mainRouter.use("/payment",paymentRouter);