import express from "express"
import { Request,Response} from "express"
import { PrismaClient } from "@prisma/client";
import { JWT_SECRET } from "../../config"
import jwt from "jsonwebtoken"
import { authMiddlewareadmin } from "../../Middlewares/authMiddlewareadmin";
import { AdminSignin, AdminSignup, item, status, visibility } from "../../zodschema/schema";

export const adminRouter=express.Router();
const prisma=new PrismaClient();
interface CustomRequest extends Request{
    username?:string
    storeId?:string
}
adminRouter.post("/signup",async (req:Request,res:Response)=>{
    let result=AdminSignup.safeParse(req.body);
    if (result["success"]==false){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
    }
    try{
        let result1=await prisma.store.findFirst({where:{storeId:req.body.storeId,storeSecret:req.body.storeSecret}});
        if (result1===null){
            res.status(400).json({"message":"Invalid Store"});
        }
        await prisma.admins.create({data:{firstName:req.body.firstName,lastName:req.body.lastName,username:req.body.username,password:req.body.password,storeId:req.body.storeId}});
        let token=jwt.sign({username:req.body.username,storeId:req.body.storeId},JWT_SECRET);
        res.json({"message":"Successful sign up","token":"Bearer "+token});
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"});
    }
})
adminRouter.post("/signin",async (req:Request,res:Response)=>{
    let result=AdminSignin.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
    }
    try{
        let result1=await prisma.admins.findFirst({where:{username:req.body.username,password:req.body.password}});
        if (result1===null){
            res.status(401).json({"message":"Invalid credentials"});
            return;
        }
        let token:string=jwt.sign({username:result1["username"],storeId:result1["storeId"]},JWT_SECRET);
        res.json({"message":"Successful sign in","token":"Bearer "+token});
    }
    catch(err){
        res.status(500).json({"message":"Internal Server Error"});
    }
})
adminRouter.get("/allorders",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.storeId as string;
    let skipcnt:number=parseInt(req.query.skipcnt as string);
    try{
        let result=await prisma.orders.findMany({where:{storeId:storeId},skip:skipcnt,take:20,orderBy:{timestamp:"desc"}});
        res.json({"orders":result});
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"});
    }
})
adminRouter.get("/pendingorders",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.storeId as string;
    try{
        let result=await prisma.orders.findMany({where:{storeId:storeId,status:"pending"},orderBy:{timestamp:"desc"}});
        res.json({"orders":result});
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"});
    }
})
adminRouter.put("/changestatus",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let result=status.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Status"});
        return;
    }
    try{
        await prisma.orders.update({where:{id:req.body.orderId,storeId:req.storeId as string},data:{status:req.body.status}})
        res.json({"message":"Status updated successfully"});
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"});
    }
})
adminRouter.get("/allitems",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{


})


adminRouter.post("/additem",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let result=item.safeParse(req.body);
    if (result['success']===false){
        res.json({"message":"Invalid Item Details"});
    }
    let storeId:string=req.storeId as string;
    try{
        req.body.storeId=storeId;
        let result1=await prisma.menu.create({data:req.body});
        res.json({"message":"Item added successfully","itemId":result1["id"]});
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"});
    }
})
adminRouter.put("/changevisibility",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.storeId as string;
    let result=visibility.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Inputs"});
    }
    try{
        let id:number=req.body.id;
        await prisma.menu.update({where:{id:id,storeId:storeId},data:{visibility:req.body.visibility}});
        res.json({"message":"Updation Successful"});
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"});
    }
})

adminRouter.get("/totaldaysales",authMiddlewareadmin,(req:CustomRequest,res:Response)=>{
    



})
adminRouter.get("/totalmonthlysales",authMiddlewareadmin,(req:CustomRequest,res:Response)=>{
    



})

