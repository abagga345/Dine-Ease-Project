import express, { NextFunction } from "express"
import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import { Request,Response} from "express"
import { JWT_SECRET } from "../../config"
import { authMiddlewareuser } from "../../Middlewares/authMiddlewareuser";
import { UserSignin, UserSignup, address, checkout, editUser, editaddress, editreview, review, visibility } from "../../zodschema/schema";
import { rolegetter } from "../../Middlewares/rolegetter";
import { sendOrderConfirmationEmail } from "./automail";
import { otpEmail,otpVerifyEmail } from "../../zodschema/schema";
import { sendOTP } from "./otp";


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
        let verification=await prisma.otpStatus.findFirst({
            where:{
                email:req.body.email
            }
        })
        if (verification===null || verification.verified===false){
            res.status(400).json({"message":"Email not verified"});
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
        console.log(err);
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
        if (result1.role==="User"){
            let token:string=jwt.sign({email:result1["email"]},JWT_SECRET);
            res.json({"message":"Successful sign in","token":"Bearer "+token});
        }
        else{
            let token:string=jwt.sign({email:result1["email"],storeId:result1["storeId"]},JWT_SECRET);
            res.json({"message":"Successful sign in","token":"Bearer "+token});
        }
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
            select:{
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
                },
                address:{
                    select:{
                        houseStreet:true,
                        state:true,
                        pincode:true
                    }
                },
                id:true,
                email:true,
                status:true,
                creationDate:true,
                description:true

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
        let result=await prisma.address.create({
            data:{
                houseStreet:req.body.houseStreet,
                state:req.body.state,
                pincode:req.body.pincode,
                email:email
            },
            select:{
                houseStreet:true,
                pincode:true,
                id:true,
                state:true
            }
        });
        res.json({"message":"Address Added successfully","address":result});
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
                state:true,
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
userRouter.get("/viewmenu",async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.query.storeId as string;
    if (storeId===undefined){
        res.status(400).json({"message":"No store selected"})
        return;
    }
    try{
        let result1=await prisma.menu.findMany({
            where:{
                storeId:storeId,
                available:true
                
            },
            select:{
                imageUrl:true,
                amount:true,
                description:true,
                id:true,
                title:true,
                visibility:true
            }
        });
        res.json({"items":result1});
    }catch(err){
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.get("/viewreviews",async (req:CustomRequest,res:Response)=>{
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
        let result = await prisma.reviews.create({
            data:{
                "email":email,
                "description":req.body.description,
                "rating":req.body.rating,
                "itemId":req.body.itemId
            },
            select:{
                id:true,
                description:true,
                user:{
                    select:{
                        firstName:true,
                        lastName:true
                    }
                },
                rating:true
            }
        });
        res.json({"message":"Review added successfully","review":result});
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
    console.log(req.body);
    let result =checkout.safeParse(req.body);
    if (result["success"]===false){
        
        res.status(400).json({"message":"INVALID INPUTS"});
        return;
    }
    try{
        let total=0;
        for(let i=0;i<req.body.items.length;i++){
            let price =await prisma.menu.findFirst({where:{id:req.body.items[i].id,storeId:req.body.storeId,visibility:true,available:true}}) ;
            if (price===null){
                res.status(400).json({"message":"Some items are out of stock or not available"});
                return;
            }
            total+=(price["amount"])*req.body.items[i].quantity;
        }
        //console.log(total);
        const shipping = parseInt(process.env.SHIPPING_COST || "0");
        const codcharges = parseInt(process.env.COD || "0");
        const taxRate = parseInt(process.env.TAX_RATE || "0");

        total += shipping + (req.body.paymentMethod === "COD" ? codcharges : 0);
        //console.log(total);
        const tax = Math.round(total * (taxRate / 100));
        total+=tax;
        //console.log(total)
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
            paymentMethod: req.body.paymentMethod,
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
        let address=await prisma.address.findFirst({
            where:{
                id:result1.addressId
            }
        })
        if ( address===null ) throw new Error();
        await sendOrderConfirmationEmail(
            req.email as string,
            result1.id,
            total,
            address.houseStreet + " , " + address.state + " , " + address.pincode,
            result1.creationDate.toLocaleDateString()
        );
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
userRouter.get("/viewmenuitem",async (req:CustomRequest,res:Response)=>{
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
                visibility:true,
                available:true
                
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
            visibility:result["visibility"] && result["available"],
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


userRouter.get("/verifyrole",rolegetter);






userRouter.post("/generateotp",async (req:Request,res:Response)=>{
    let result =otpEmail.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"INVALID INPUTS"});
        return;
    }
    try{
        //extra otp computation is better than additional db call to check for verified 
        let otp=Math.floor(100000 + Math.random() * 900000).toString();
        let hashedotp = await bcrypt.hash(otp,5);
        const creationDate = new Date();                       
        const expirationDate = new Date(
            creationDate.getTime() + 15 * 60_000     
        );
        let result=await prisma.otpStatus.upsert({
            where:{
                email:req.body.email
            },
            update:{
                otp:hashedotp,
                creationDate:creationDate,
                expirationDate:expirationDate
            },
            create:{
                email:req.body.email,
                otp:hashedotp,
                verified:false,
                creationDate,
                expirationDate
            }
        })
        console.log("email"+req.body.email);
        console.log("otp"+otp);
        await sendOTP(req.body.email,otp);
        res.json({"message":"Otp Generated Successfully"});
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"})
    }
})

userRouter.put("/verifyotp",async (req:Request,res:Response)=>{
    let result =otpVerifyEmail.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"INVALID INPUTS"});
        return;
    }
    let email:string=req.body.email;
    let inputotp:string=req.body.otp;
    try{
        let result=await prisma.otpStatus.findFirst({
            where:{
                email:email
            }
        })
        if (result===null){
            res.status(400).json({"message":"INVALID EMAIL"});
            return;
        }
        if (result.verified){
            await prisma.otpStatus.update({
                where:{
                    id:result.id
                },
                data:{
                    verified:true
                }
            })
            res.json({"message":"User Verified Successfully"});
            return;
        }
        let cur=new Date();
        let expiry=result.expirationDate;
        if (expiry<cur){
            res.status(400).json({"message":"Otp Expired"});
            return;
        }
        if (await bcrypt.compare(inputotp,result["otp"]) || result.verified){
            await prisma.otpStatus.update({
                where:{
                    id:result.id
                },
                data:{
                    verified:true
                }
            })
            res.json({"message":"User Verified Successfully"});
        }
        else{
            res.status(400).json({"message":"Invalid Otp"})
        }
    }catch(err){
        res.status(500).json({"message":"Internal Server Error"})
    }
})


userRouter.get("/allstores",async (req:Request,res:Response)=>{
    try{
        let result=await prisma.store.findMany(
            {
                select:{
                    storeId:true,
                    storeStreet:true,
                    state:true,
                    pincode:true
                }
            }
        );
        res.json({
            "message":"Stores fetched successfully",
            "stores":result
        })
    }catch(err){
        console.log(err);
        res.status(500).json({"message":"Internal Server Error"})
    }
})