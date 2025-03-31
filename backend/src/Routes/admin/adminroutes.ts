import express from "express"
import { Request,Response} from "express"
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import { JWT_SECRET } from "../../config"
import jwt from "jsonwebtoken"
import { authMiddlewareadmin } from "../../Middlewares/authMiddlewareadmin";
import { AdminSignin,status, visibility,additem, AdminSignup } from "../../zodschema/schema";

export const adminRouter=express.Router();
const prisma=new PrismaClient();
interface CustomRequest extends Request{
    username?:string
    storeId?:string
}

//CHECKED
adminRouter.post("/signin",async (req:Request,res:Response)=>{
    let result=AdminSignin.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
    }
    try{
        let result1=await prisma.users.findFirst({
            where:{
                email:req.body.email,
                role:'Admin'
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

//CHECKED
adminRouter.get("/allorders",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.storeId as string;
    // let skipcnt:number=parseInt(req.query.skipcnt as string);
    try{
        let result=await prisma.orders.findMany({
            where:{
                storeId:storeId
            },
            orderBy:{
                creationDate:"desc"
            }
        });
        res.json({"orders":result});
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"});
    }
})

//CHECKED
adminRouter.get("/unconfirmedorders",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.storeId as string;
    try{
        let result=await prisma.orders.findMany({
            where:{
                storeId:storeId,
                status:'Unconfirmed'
            },
            orderBy:{
                creationDate:"desc"
            }
        });
        res.json({"orders":result});
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"});
    }
})

//CHECKED
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

//CHECKED
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
                description:true,
                visibility:true,
                title:true
            }
        })
        res.json({"items":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
adminRouter.post("/additem",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let result=additem.safeParse(req.body);
    if (result['success']===false){
        console.log(result["error"]);
        res.status(400).json({"message":"Invalid Item Details"});
        return;
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

//CHECKED
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
                  creationDate: {
                    gte: new Date(currentYear, currentMonth, currentDay), 
                  },
                },
                {
                  creationDate: {
                    lt: new Date(currentYear, currentMonth, currentDay+1), 
                  },
                },
              ],
              status:"Delivered"
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
                  creationDate: {
                    gte: new Date(currentYear, currentMonth-1, currentDay+1), 
                  },
                },
                {
                  creationDate: {
                    lt: new Date(currentYear, currentMonth, currentDay+1), 
                  },
                },
              ],
              status:"Delivered"
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


//CHECKED
adminRouter.post("/signup",async (req:Request,res:Response)=>{
    let result=AdminSignup.safeParse(req.body);
    if (result["success"]==false){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
    }
    try{
        let result1=await prisma.store.findFirst({where:{storeId:req.body.storeId}});
        if (result1===null){
            res.status(400).json({"message":"Invalid Store"});
            return;
        }
        let result2=await prisma.users.findFirst({where:{email:req.body.email}});
        if (result2!==null){
            res.status(400).json({"message":"User already exists"});
            return;
        }
        let temp=await bcrypt.hash(req.body.password,5);
        await prisma.users.create({
            data:{
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                email:req.body.email,
                password:temp,
                storeId:req.body.storeId,
                role:'Admin',
                contactNo:req.body.contactNo
            }
        });
        let token=jwt.sign({username:req.body.username,storeId:req.body.storeId},JWT_SECRET);
        res.json({"message":"Successful sign up","token":"Bearer "+token});
    }catch(err){
        console.log(err);
        res.status(500).json({"message":"Internal Server Error"});
    }
})