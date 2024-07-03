import express, { NextFunction } from "express"
import { Request,Response} from "express"
import { JWT_SECRET } from "../../config"
import { authMiddleware } from "../../Middlewares/authMiddleware";
export const userRouter=express.Router();
interface CustomRequest extends Request{
    username?:String
}

userRouter.post("/signup",(req:Request,res:Response,next:NextFunction)=>{
    
})

userRouter.post("/signin",(req:Request,res:Response,next:NextFunction)=>{

})

userRouter.get("/vieworders",authMiddleware,(req:CustomRequest,res:Response)=>{

})

userRouter.post("/addaddress",authMiddleware,(req:CustomRequest,res:Response)=>{

})

userRouter.get("/viewmenu",authMiddleware,(req:CustomRequest,res:Response)=>{

})

userRouter.get("/viewreviews",authMiddleware,(req:CustomRequest,res:Response)=>{

})

userRouter.post("/dropreviews",authMiddleware,(req:CustomRequest,res:Response)=>{

})


userRouter.post("/checkout",authMiddleware,(req:CustomRequest,res:Response)=>{

})

userRouter.put("/editprofile",authMiddleware,(req:CustomRequest,res:Response)=>{

})

