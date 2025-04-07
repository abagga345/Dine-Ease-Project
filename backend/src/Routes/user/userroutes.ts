import express, { NextFunction } from "express"
import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import { Request,Response} from "express"
import { JWT_SECRET } from "../../config"
import { authMiddlewareuser } from "../../Middlewares/authMiddlewareuser";
import { UserSignin, UserSignup, address, checkout, editUser, editaddress, editreview, review, visibility } from "../../zodschema/schema";


export const userRouter=express.Router();
const prisma=new PrismaClient();
interface CustomRequest extends Request{
    email?:string
}
interface Item{
    id:number,
    quantity:number
}

//CHECKED 
userRouter.post("/signup",async (req:Request,res:Response,next:NextFunction)=>{
    let result=UserSignup.safeParse(req.body);
    if (result["success"]==false){
        console.log(result["error"]);
        console.log(req.body);
        res.status(400).json({"message":"INVALID INPUTS"});
        return;
    }
    try{
        let result2=await prisma.users.findFirst({where:{email:req.body.email}});
        if (result2!==null){
            res.status(400).json({"message":"User already exists"});
            return;
        }
        let temp=await bcrypt.hash(req.body.password,5);
        let result1=await prisma.users.create({
            data:{
                email:req.body.email,
                firstName:req.body.firstName,
                lastName:req.body.lastName,
                password:temp,
                contactNo:req.body.contactNo,
                role:'User'
            },
            select:{
                email:true
            }
        }) as {email:string};
        let token=jwt.sign({email:result1["email"]},JWT_SECRET);
        res.json({"message":"Successful sign up","token":"Bearer "+token});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.post("/signin",async (req:Request,res:Response,next:NextFunction)=>{
    let result=UserSignin.safeParse(req.body);
    if (result["success"]==false){
        res.status(400).json({"message":"INVALID DATA"});
        return;
    }
    try{
        let result1=await prisma.users.findFirst({
            where:{
                email:req.body.email
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
        let token:string=jwt.sign({email:result1["email"]},JWT_SECRET);
        res.json({"message":"Successful sign in","token":"Bearer "+token});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.get("/vieworders",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    try{
       
        let result1=await prisma.orders.findMany({
            where:{
                email:req.email as string
            },
            include:{
                items:{
                    select:{
                        quantity:true,itemId:true,
                        item:{
                            select:{
                                amount:true,
                                title:true,
                                
                            }
                        }
                    }
                }
            }
        });
        res.json({"orders":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.post("/addaddress",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    // need some  limit on address count 
    let result=address.safeParse(req.body);
    if (result["success"]==false){
        res.status(400).json({"message":"INVALID ADDRESS"});
        return;
    }
    let email:string=req.email as string;
    try{
        await prisma.address.create({
            data:{
                houseStreet:req.body.houseStreet,
                city:req.body.city,
                pincode:req.body.pincode,
                email:email
            }
        });
        res.json({"message":"Address Added successfully"});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.get("/getaddresses",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let email:string=req.email as string;
    try{
        
        let result1=await prisma.address.findMany({
            where:{
                email:email
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

//CHECKED
userRouter.get("/viewmenu",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.query.storeId as string;
    if (storeId===undefined){
        res.status(400).json({"message":"No store selected"})
        return;
    }
    try{
        let result1=await prisma.menu.findMany({
            where:{
                storeId:storeId,
                visibility:true
            },
            select:{
                imageUrl:true,
                amount:true,
                description:true,
                id:true,
                title:true
            }
        });
        res.json({"items":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.get("/viewreviews",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let id:number=parseInt(req.query.itemId as string);
    try{
        let result1=await prisma.reviews.findMany({
            where:{
                itemId:id
            },
            select:{
                id:true,
                description:true,
                rating:true,
                user:{
                    select:{
                        firstName:true,
                        lastName:true
                    }
                }
            }
        });
        res.json({"reviews":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.post("/dropreview",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let result=review.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"INVALID REVIEW"});
        return;
    }
    let email:string=req.email as string;
    try{
        await prisma.reviews.create({
            data:{
                "email":email,
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

//CHECKED
userRouter.delete("/deletereview",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let id:number=parseInt(req.query.reviewId as string);
    try{
        await prisma.reviews.delete({
            where:{
                id:id,
                email:req.email as string
            }
        });
        res.json({"message":"Review Deleted Successfully"});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})



//CHECKED ===> NORMAL , VISIBILITY , PRICE UDPATION
userRouter.post("/checkout",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    
    let result =checkout.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"INVALID INPUTS"});
    }
    try{
        let total=0;
        for(let i=0;i<req.body.items.length;i++){
            let price =await prisma.menu.findFirst({where:{id:req.body.items[i].id,storeId:req.body.storeId,visibility:true}}) ;
            if (price===null){
                res.status(400).json({"message":"Some items are out of stock"});
                return;
            }
            total+=(price["amount"])*req.body.items[i].quantity;
        }
        if (total!==req.body.amount){
            res.status(400).json({"message":"Price updated,Please retry"});
            return;
        }
        let result1=await prisma.orders.create({data:{
            amount:total,
            storeId:req.body.storeId,
            email:req.email as string,
            description:req.body.description,
            status:'Unconfirmed',
            addressId:req.body.addressId,
            items:{
                create:req.body.items.map((element:Item)=>{
                    return{
                        itemId:element.id,
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
//CHECKED
userRouter.put("/editreview",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let rev_id:number=parseInt(req.query.reviewId as string);
    let email:string=req.email as string;
    let result=editreview.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
    }
    try{
        let result1=await prisma.reviews.update({
            where:{
                id:rev_id,
                email:email
            },
            data:req.body
        });
        res.json({"message":"Review updated successfully","review":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED 
userRouter.put("/editprofile",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let email:string=req.email as string;
    let result=editUser.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
    }
    try{
        let result1=await prisma.users.update({
            where:{
                email:email
            },
            data:req.body,
            select:{
                id:true,
                email:true,
                firstName:true,
                lastName:true,
                contactNo:true,
                
            }
        });
        res.json({"message":"Profile updated successfully","profile":result1});
    }catch(err){
        console.log(err);
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }

})

//CHECKED
userRouter.put("/editaddress",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let add_id:number=parseInt(req.query.id as string);
    let result=editaddress.safeParse(req.body);
    let email:string=req.email as string;
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
    }
    try{
        let result1=await prisma.address.update({
            where:{
                id:add_id,
                email:email
            },
            data:req.body
        });
        res.json({"message":"Address updated successfully","address":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.delete("/deleteaddress",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let id:number=parseInt(req.query.id as string);
    let email:string=req.email as string;
    try{
        await prisma.address.delete({
            where:{
                email:email,
                id:id
            }
        });
        res.json({"message":"Address removed successfully"});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.get("/viewmenuitem",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let itemId:number=parseInt(req.query.itemId as string);
    try{
        let result=await prisma.menu.findFirst({
            where:{
                id:itemId
            },
            select:{
                id:true,
                imageUrl:true,
                title:true,
                amount:true,
                description:true,
                storeId:true,
                visibility:true
                
            }
        })
        if (result===null){
            res.status(400).json({"message":"No such item exists"});
            return;
        }
        res.json({"message":"Item fetched successfully",
            id:result["id"],
            imageUrl:result["imageUrl"],
            description:result["description"],
            visibility:result["visibility"],
            storeId:result["storeId"],
            amount:result["amount"],
            title:result["title"]
        })
    }catch(err){
        res.status(500).json({"message":"Internal server error"})
    }
})

//CHECKED
userRouter.get("/viewprofile",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let email:string=req.email as string;
    try{
        let result=await prisma.users.findFirst({
            where:{
                "email":email
            },
            select:{
                firstName:true,
                lastName:true,
                contactNo:true,
                email:true,
                role:true
            }
        })
        if (result===null){
            throw new Error();
        }
        res.json({"message":"Profile fetched successfully",
            "firstName":result["firstName"],
            "lastName":result["lastName"],
            "contactNo":result["contactNo"],
            "email":result["email"]
        })
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"})
    }
})