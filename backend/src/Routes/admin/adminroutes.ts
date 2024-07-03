import express from "express"
import { Request,Response} from "express"
import { JWT_SECRET } from "../../config"
import { authMiddleware } from "../../Middlewares/authMiddleware";
export const adminRouter=express.Router();
interface CustomRequest extends Request{
    username?:String
}
adminRouter.post("/signup",(req:Request,res:Response)=>{
    
})
adminRouter.post("/signin",(req:Request,res:Response)=>{
    
})
adminRouter.get("/allorders",authMiddleware,(req:Request,res:Response)=>{
    
})
adminRouter.put("/changestatus",authMiddleware,(req:Request,res:Response)=>{
    
})
adminRouter.post("/additem",authMiddleware,(req:Request,res:Response)=>{
    
})
adminRouter.put("/changevisibility",authMiddleware,(req:Request,res:Response)=>{
    
})