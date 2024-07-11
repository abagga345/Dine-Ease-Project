import express, { NextFunction } from "express"
import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import { Request,Response} from "express"
import { JWT_SECRET } from "../../config"
import { authMiddlewareuser } from "../../Middlewares/authMiddlewareuser";
import { UserSignin, UserSignup, address, checkout, editUser, editaddress, editreview, review } from "../../zodschema/schema";

export const userRouter=express.Router();
const prisma=new PrismaClient();
interface CustomRequest extends Request{
    username?:string
}
interface Item{
    id:number,
    quantity:number
}

userRouter.post("/signup",async (req:Request,res:Response,next:NextFunction)=>{
    try{
    let result=UserSignup.parse(req.body);
    // if (result["success"]==false){
    //     res.status(400).json({"message":"INVALID INPUTS"});
    //     return;
    // }
    }catch(err){
        console.log(err);
    }
    try{
        let result2=await prisma.users.findFirst({where:{username:req.body.username}});
        if (result2!==null){
            res.status(400).json({"message":"User already exists"});
            return;
        }
        let temp=await bcrypt.hash(req.body.password,5);
        let result1=await prisma.users.create({
            data:{
                username:req.body.username,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                password:temp,
                contactNo:req.body.contactNo
            },
            select:{
                username:true
            }
        }) as {username:string};
        let token=jwt.sign({username:result1["username"]},JWT_SECRET);
        res.json({"message":"Successful sign up","token":"Bearer "+token});
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
        let result1=await prisma.users.findFirst({
            where:{
                username:req.body.username
            }
        });
        if (result1===null){
            res.status(401).json({"message":"Invalid credentials"});
            return;
        }
        if (! await bcrypt.compare(req.body.password,result1["password"])){
            res.status(401).json({"message":"Unauthorised"});
            return;
        }
        let token:string=jwt.sign({username:result1["username"]},JWT_SECRET);
        res.json({"message":"Successful sign in","token":"Bearer "+token});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.get("/vieworders",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    try{
        let result1=await prisma.orders.findMany({
            where:{
                username:req.username as string
            },
            include:{
                items:{
                    select:{
                        quantity:true,itemId:true
                    }
                }
            }
        });
        res.json({"orders":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.post("/addaddress",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let result=address.safeParse(req.body);
    if (result["success"]==false){
        res.status(400).json({"message":"INVALID ADDRESS"});
        return;
    }
    let username:string=req.username as string;
    try{
        await prisma.address.create({
            data:{
                houseStreet:req.body.houseStreet,
                city:req.body.city,
                pincode:req.body.pincode,
                username:username
            }
        });
        res.json({"message":"Address Added successfully"});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.get("/getaddresses",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let username:string=req.username as string;
    try{
        let result1=await prisma.address.findMany({
            where:{
                username:username
            },
            select:{
                id:true,
                city:true,
                pincode:true,
                houseStreet:true
            }
        });
        res.json({"addresses":result1});
    }catch(err){
        console.log(err);
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.get("/viewmenu",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.query.storeId as string;
    try{
        let result1=await prisma.menu.findMany({
            where:{
                storeId:storeId,
                visibility:true
            },
            select:{
                imageUrl:true,
                amount:true,
                discount:true,
                details:true,
                id:true
            }
        });
        res.json({"items":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.get("/viewreviews",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let id:number=parseInt(req.query.itemId as string);
    try{
        let result1=await prisma.reviews.findMany({
            where:{
                itemId:id
            },
            select:{
                id:true,
                username:true,
                description:true,
                rating:true
            }
        });
        res.json({"reviews":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.post("/dropreview",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let result=review.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"INVALID REVIEW"});
        return;
    }
    let username:string=req.username as string;
    try{
        await prisma.reviews.create({
            data:{
                "username":username,
                "description":req.body.description,
                "rating":req.body.rating,
                "itemId":req.body.itemId
            }
        });
        res.json({"message":"Review added successfully"});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.delete("/deletereview",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let id:number=parseInt(req.query.id as string);
    try{
        await prisma.reviews.delete({
            where:{
                id:id,
                username:req.username as string
            }
        });
        res.json({"message":"Review Deleted Successfully"});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})




userRouter.post("/checkout",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    
    let result =checkout.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"INVALID INPUTS"});
    }
    try{
        let total=0;
        for(let i=0;i<req.body.items.length;i++){
            let price =await prisma.menu.findFirst({where:{id:req.body.items[i].id,storeId:req.body.storeId}}) ;
            if (price===null){
                throw new Error;
            }
            total+=(price["amount"]-price["discount"])*req.body.items[i].quantity;
        }
        if (total!==req.body.amount){
            res.status(400).json({"message":"Price updated,Please retry"});
        }
        let result1=await prisma.orders.create({data:{
            amount:total,
            storeId:req.body.storeId,
            username:req.username as string,
            description:req.body.description,
            status:"pending",
            items:{
                create:req.body.items.map((element:Item)=>{
                    return{
                        id:element.id,
                        quantity:element.quantity
                    } 
                })
            }
        }})
        res.json({"message":"Order placed successfully","orderId":result1["id"]});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    } 
})
userRouter.put("/editreview",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let rev_id:number=parseInt(req.query.id as string);
    let result=editreview.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
    }
    try{
        let result1=await prisma.reviews.update({
            where:{
                id:rev_id
            },
            data:req.body
        });
        res.json({"message":"Review updated successfully","review":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})


userRouter.put("/editprofile",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let username:string=req.username as string;
    let result=editUser.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
    }
    try{
        let result1=await prisma.users.update({
            where:{
                username:username
            },
            data:req.body
        });
        res.json({"message":"Profile updated successfully","profile":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }

})

userRouter.put("/editaddress",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let add_id:number=parseInt(req.query.id as string);
    let result=editaddress.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
    }
    try{
        let result1=await prisma.address.update({
            where:{
                id:add_id
            },
            data:req.body
        });
        res.json({"message":"Address updated successfully","address":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.delete("/deleteaddress",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let id:number=parseInt(req.query.id as string);
    let username:string=req.username as string;
    try{
        await prisma.address.delete({
            where:{
                username:username,
                id:id
            }
        });
        res.json({"message":"Address removed successfully"});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

userRouter.get("/filteritems:filter",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.query.storeId as string;
    let filter:string=req.params.filter as string;
    try{
        let result1=await prisma.menu.findMany({
            where:{
                OR:[
                    {title:{contains:filter},storeId:storeId},
                    {details:{contains:filter},storeId:storeId}
                ]
            },
            select:{
                imageUrl:true,
                amount:true,
                discount:true,
                details:true,
                id:true
            }
        });
        res.json({"items":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})