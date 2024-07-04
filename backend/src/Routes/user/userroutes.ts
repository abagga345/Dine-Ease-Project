import express, { NextFunction } from "express"
import  jwt  from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { Request,Response} from "express"
import { JWT_SECRET } from "../../config"
import { authMiddleware } from "../../Middlewares/authMiddleware";
import { UserSignin, UserSignup, address } from "../../zodschema/schema";

export const userRouter=express.Router();
const prisma=new PrismaClient();
interface CustomRequest extends Request{
    username?:string
}

userRouter.post("/signup",async (req:Request,res:Response,next:NextFunction)=>{
    let result=UserSignup.safeParse(req.body);
    if (result["success"]==false){
        res.status(400).json({"message":"INVALID DATA"});
        return;
    }
    try{
        let result2=await prisma.users.findFirst({where:{username:req.body.username}});
        if (result2!==null){
            res.status(400).json({"message":"User already exists"});
            return;
        }
        let result1=await prisma.users.create({data:{username:req.body.username,firstName:req.body.firstName,lastName:req.body.lastName,password:req.body.password,contactNo:req.body.contactNo},select:{username:true}}) as {username:string};
        let token=jwt.sign({username:result1["username"]},JWT_SECRET);
        res.json({"message":"Successful sign up","token":token});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.post("/signin",async (req:Request,res:Response,next:NextFunction)=>{
    let result=UserSignin.safeParse(req.body);
    if (result["success"]==false){
        res.status(400).json({"message":"INVALID DATA"});
        return;
    }
    try{
        let result1=await prisma.users.findFirst({where:{username:req.body.username,password:req.body.password}});
        if (result1===null){
            res.status(401).json({"message":"Invalid credentials"});
            return;
        }
        let token:string=jwt.sign({username:result1["username"]},JWT_SECRET);
        res.json({"message":"Successful sign in","token":token});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.get("/vieworders",authMiddleware,async (req:CustomRequest,res:Response)=>{
    try{
        let result1=await prisma.orders.findMany({where:{username:req.username as string},include:{items:{select:{quantity:true,itemId:true}}}});
        res.json({"orders":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.post("/addaddress",authMiddleware,async (req:CustomRequest,res:Response)=>{
    let result=address.safeParse(req.body);
    if (result["success"]==false){
        res.status(400).json({"message":"INVALID ADDRESS"});
        return;
    }
    let username:string=req.username as string;
    try{
        await prisma.address.create({data:{houseStreet:req.body.houseStreet,city:req.body.city,pincode:req.body.pincode,username:username}});
        res.json({"message":"Address Added successfully"});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.get("/viewmenu",authMiddleware,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.query.storeId as string;
    try{
        let result1=await prisma.menu.findMany({where:{storeId:storeId,visibility:true},select:{imageUrl:true,amount:true,discount:true,details:true}});
        res.json({"items":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.get("/viewreviews",authMiddleware,(req:CustomRequest,res:Response)=>{
    
})

userRouter.post("/dropreviews",authMiddleware,(req:CustomRequest,res:Response)=>{

})


userRouter.post("/checkout",authMiddleware,(req:CustomRequest,res:Response)=>{

})

userRouter.put("/editprofile",authMiddleware,(req:CustomRequest,res:Response)=>{

})

