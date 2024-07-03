import express from "express"
import {userRouter} from "./user/userroutes"
import {adminRouter} from "./admin/adminroutes"

export const mainRouter=express.Router();

mainRouter.use("/user",userRouter);

mainRouter.use("/admin",adminRouter);