import express from "express"
import { Request,Response} from "express"
import bcrypt from "bcrypt"
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
        let result2=await prisma.admins.findFirst({where:{username:req.body.username}});
        if (result2!==null){
            res.status(400).json({"message":"User already exists"});
            return;
        }
        let temp=await bcrypt.hash(req.body.password,5);
        await prisma.admins.create({
            data:{
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                username:req.body.username,
                password:temp,
                storeId:req.body.storeId
            }
        });
        let token=jwt.sign({username:req.body.username,storeId:req.body.storeId},JWT_SECRET);
        res.json({"message":"Successful sign up","token":"Bearer "+token});
    }catch(err){
        console.log(err);
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
        let result1=await prisma.admins.findFirst({
            where:{
                username:req.body.username
            }
        });
        if (result1===null){
            res.status(401).json({"message":"Invalid credentials"});
            return;
        }
        if (!await bcrypt.compare(req.body.password,result1["password"])){
            res.status(401).json({"message":"Unauthorised "});
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
        let result=await prisma.orders.findMany({
            where:{
                storeId:storeId
            },
            skip:(skipcnt-1)*15,
            take:15,
            orderBy:{
                timestamp:"desc"
            }
        });
        res.json({"orders":result});
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"});
    }
})
adminRouter.get("/pendingorders",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.storeId as string;
    try{
        let result=await prisma.orders.findMany({
            where:{
                storeId:storeId,
                status:'Pending'
            },
            orderBy:{
                timestamp:"desc"
            }
        });
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
        await prisma.orders.update({
            where:{
                id:req.body.orderId,
                storeId:req.storeId as string
            },
            data:{
                status:req.body.status
            }
        })
        res.json({"message":"Status updated successfully"});
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"});
    }
})
adminRouter.get("/allitems",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.storeId as string;
    try{
        let result1=await prisma.menu.findMany({
            where:{
                storeId:storeId
            },
            select:{
                id:true,
                imageUrl:true,
                amount:true,
                discount:true,
                details:true,
                visibility:true,
                title:true
            }
        })
        res.json({"items":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
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
        await prisma.menu.update({
            where:{
                id:id,
                storeId:storeId
            },
            data:{
                visibility:req.body.visibility
            }
        });
        res.json({"message":"Updation Successful"});
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"});
    }
})

adminRouter.get("/totaldaysales",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    const dateobj=new Date();
    let currentYear=dateobj.getFullYear();
    let currentMonth=dateobj.getMonth();
    let currentDay=dateobj.getDate();
    try{
        const total = await prisma.orders.aggregate({
            where: {
              AND: [
                {
                  timestamp: {
                    gte: new Date(currentYear, currentMonth, currentDay), 
                  },
                },
                {
                  timestamp: {
                    lt: new Date(currentYear, currentMonth, currentDay+1), 
                  },
                },
              ],
            },
            _sum:{
                amount:true
            }
        });
        res.json({"total":total["_sum"]["amount"]});

    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }

})
adminRouter.get("/totalmonthlysales",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    const dateobj=new Date();
    let currentYear=dateobj.getFullYear();
    let currentMonth=dateobj.getMonth(); 
    let currentDay=dateobj.getDate();
    try{ 
        const total = await prisma.orders.aggregate({
            where: {
              AND: [
                {
                  timestamp: {
                    gte: new Date(currentYear, currentMonth-1, currentDay+1), 
                  },
                },
                {
                  timestamp: {
                    lt: new Date(currentYear, currentMonth, currentDay+1), 
                  },
                },
              ],
            },
            _sum:{
                amount:true
            }
        });
        res.json({"total":total["_sum"]["amount"]});

    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

