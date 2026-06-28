import express, { NextFunction } from "express"
import  jwt  from "jsonwebtoken";
import bcrypt from "bcrypt"
import { Request,Response} from "express"
import { JWT_SECRET } from "../../config"
import { authMiddlewareuser } from "../../Middlewares/authMiddlewareuser";
import { UserSignin, UserSignup, address, checkout, editUser, editaddress, editreview, review, visibility, razorpayCreateOrder, verifyPayment } from "../../zodschema/schema";
import { rolegetter } from "../../Middlewares/rolegetter";
import { sendOrderConfirmationEmail } from "./automail";
import { otpEmail,otpVerifyEmail } from "../../zodschema/schema";
import { sendOTP } from "./otp";
import { prisma } from "../../prismaClient";
import { computeOrderTotal } from "../../utils/pricing";
import { Prisma } from "@prisma/client";
import { getRazorpay, getPublicKeyId, isRazorpayConfigured, verifyPaymentSignature } from "./razorpayClient";

// Bcrypt salt rounds used everywhere passwords/otps are hashed.
const BCRYPT_ROUNDS = 10;

export const userRouter=express.Router();
interface CustomRequest extends Request{
    email?:string
}
interface Item{
    id:number,
    quantity:number
}

// Carries an HTTP status out of a transaction so the catch block can map it to
// the right client response instead of a generic 500.
class OrderError extends Error{
    status:number;
    constructor(status:number,message:string){
        super(message);
        this.status=status;
    }
}

// Re-validate item prices/visibility against the DB inside a transaction and
// recompute the authoritative order total. Throws OrderError if an item is
// unavailable or the client-sent amount no longer matches. Shared by the COD
// checkout and the Razorpay create-order flow so the server is always the
// source of truth for the amount.
async function priceAndValidateOrder(
    tx: Prisma.TransactionClient,
    body: { items: Item[]; storeId: string; amount: number; paymentMethod: string }
): Promise<number> {
    const lines: { amount: number; quantity: number }[] = [];
    for (let i = 0; i < body.items.length; i++) {
        const price = await tx.menu.findFirst({
            where: { id: body.items[i].id, storeId: body.storeId, visibility: true, available: true }
        });
        if (price === null) {
            throw new OrderError(400, "Some items are out of stock or not available");
        }
        lines.push({ amount: price.amount, quantity: body.items[i].quantity });
    }

    const shipping = parseInt(process.env.SHIPPING_COST || "0");
    const codcharges = parseInt(process.env.COD || "0");
    const taxRate = parseInt(process.env.TAX_RATE || "0");

    const total = computeOrderTotal(lines, { shipping, cod: codcharges, taxRate, paymentMethod: body.paymentMethod });
    if (total !== body.amount) {
        throw new OrderError(400, "Price updated,Please retry");
    }
    return total;
}

//CHECKED 
userRouter.post("/signup",async (req:Request,res:Response,next:NextFunction)=>{
    let result=UserSignup.safeParse(req.body);
    if (result["success"]==false){
        req.log.warn("Signup rejected: invalid inputs");
        res.status(400).json({"message":"INVALID INPUTS"});
        return;
    }
    try{
        req.log.info({email:req.body.email},"Signup attempt");
        let result2=await prisma.users.findFirst({where:{email:req.body.email}});
        if (result2!==null){
            req.log.warn({email:req.body.email},"Signup rejected: user already exists");
            res.status(400).json({"message":"User already exists"});
            return;
        }
        let verification=await prisma.otpStatus.findFirst({
            where:{
                email:req.body.email
            }
        })
        if (verification===null || verification.verified===false){
            req.log.warn({email:req.body.email},"Signup rejected: email not verified");
            res.status(400).json({"message":"Email not verified"});
            return;
        }
        let temp=await bcrypt.hash(req.body.password,BCRYPT_ROUNDS);
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
        // Clear the verified flag so a stale verification can't be reused to
        // re-register/verify this email without a fresh OTP.
        await prisma.otpStatus.updateMany({
            where:{email:req.body.email},
            data:{verified:false}
        });
        let token=jwt.sign({email:result1["email"]},JWT_SECRET,{expiresIn:"7d"});
        req.log.info({email:result1["email"]},"Signup successful");
        res.json({"message":"Successful sign up","token":"Bearer "+token});
    }catch(err){
        req.log.error({err},"Unexpected error handling request");
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
            req.log.warn({email:req.body.email},"Signin failed: no such user");
            res.status(401).json({"message":"Invalid credentials"});
            return;
        }
        if (! await bcrypt.compare(req.body.password,result1["password"])){
            req.log.warn({email:req.body.email},"Signin failed: bad password");
            res.status(401).json({"message":"Unauthorised"});
            return;
        }
        if (result1.role==="User"){
            let token:string=jwt.sign({email:result1["email"]},JWT_SECRET,{expiresIn:"7d"});
            req.log.info({email:result1["email"],role:result1.role},"Signin successful");
            res.json({"message":"Successful sign in","token":"Bearer "+token});
        }
        else{
            let token:string=jwt.sign({email:result1["email"],storeId:result1["storeId"]},JWT_SECRET,{expiresIn:"7d"});
            req.log.info({email:result1["email"],role:result1.role,storeId:result1["storeId"]},"Signin successful");
            res.json({"message":"Successful sign in","token":"Bearer "+token});
        }
    }catch(err){
        req.log.error({err},"Unexpected error handling request");
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
                store: {
                    select: {
                        storeStreet: true,
                        state: true,
                        pincode: true
                }
    },
                id:true,
                email:true,
                status:true,
                creationDate:true,
                description:true,
            }
        });
        res.json({"orders":result1});
    }catch(err){
        req.log.error({err},"Unexpected error handling request");
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
        req.log.error({err},"Unexpected error handling request");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.get("/getaddresses",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let email:string=req.email as string;
    try{
        
        let result1=await prisma.address.findMany({
            where:{
                email:email,
                availability:true
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
        req.log.error({err},"Unexpected error handling request");
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
                available:true,
                visibility:true

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
        req.log.error({err},"Unexpected error handling request");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.get("/viewreviews",async (req:CustomRequest,res:Response)=>{
    let id:number=parseInt(req.query.itemId as string);
    if (Number.isNaN(id)){
        res.status(400).json({"message":"Invalid id"});
        return;
    }
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
        req.log.error({err},"Unexpected error handling request");
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
        req.log.error({err},"Unexpected error handling request");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.delete("/deletereview",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let id:number=parseInt(req.query.reviewId as string);
    if (Number.isNaN(id)){
        res.status(400).json({"message":"Invalid id"});
        return;
    }
    try{
        await prisma.reviews.delete({
            where:{
                id:id,
                email:req.email as string
            }
        });
        res.json({"message":"Review Deleted Successfully"});
    }catch(err){
        req.log.error({err},"Unexpected error handling request");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})



//CHECKED ===> NORMAL , VISIBILITY , PRICE UDPATION
userRouter.post("/checkout",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    // console.log(req.body);
    let result =checkout.safeParse(req.body);
    if (result["success"]===false){
        req.log.warn("Checkout rejected: invalid inputs");
        res.status(400).json({"message":"INVALID INPUTS"});
        return;
    }
    try{
        const email=req.email as string;
        req.log.info({storeId:req.body.storeId,itemCount:req.body.items?.length,paymentMethod:req.body.paymentMethod},"Checkout started");

        // Validate the address up-front: it must exist, belong to this user, and
        // be available. Done BEFORE order creation so we never respond twice.
        const address=await prisma.address.findFirst({
            where:{
                id:req.body.addressId,
                email:email,
                availability:true
            }
        });
        if (address===null){
            req.log.warn({addressId:req.body.addressId},"Checkout rejected: invalid address");
            res.status(400).json({"message":"Invalid address"});
            return;
        }

        // Re-validate prices/visibility and create the order atomically so the
        // total can't be raced against a concurrent price change.
        const result1=await prisma.$transaction(async (tx)=>{
            const total=await priceAndValidateOrder(tx,{items:req.body.items,storeId:req.body.storeId,amount:req.body.amount,paymentMethod:req.body.paymentMethod});

            return tx.orders.create({data:{
                amount:total,
                storeId:req.body.storeId,
                email:email,
                description:req.body.description ?? "",
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
            }});
        });

        // Fire-and-forget confirmation email: never touches res, never throws
        // into this handler.
        sendOrderConfirmationEmail(
            email,
            result1.id,
            result1.amount,
            address.houseStreet + " , " + address.state + " , " + address.pincode,
            result1.creationDate.toLocaleDateString()
        ).catch((err)=>req.log.error({err,orderId:result1.id},"Order confirmation email failed"));

        req.log.info({orderId:result1.id,amount:result1.amount},"Order placed successfully");
        res.json({"message":"Order placed successfully","orderId":result1["id"]});
    }catch(err){
        if (err instanceof OrderError){
            req.log.warn({status:err.status,reason:err.message},"Checkout rejected");
            res.status(err.status).json({"message":err.message});
            return;
        }
        req.log.error({err},"Unexpected error during checkout");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

// Razorpay "Pay Online": create a Razorpay order + a local Pending order row.
// The order is recorded now (so failures are persisted) but stays hidden from
// the store until payment is verified (paymentStatus -> Paid).
userRouter.post("/payment/create-order",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let result=razorpayCreateOrder.safeParse(req.body);
    if (result["success"]===false){
        req.log.warn("Razorpay create-order rejected: invalid inputs");
        res.status(400).json({"message":"INVALID INPUTS"});
        return;
    }
    if (!isRazorpayConfigured()){
        req.log.error("Razorpay create-order failed: gateway not configured");
        res.status(503).json({"message":"Online payment is currently unavailable"});
        return;
    }
    try{
        const email=req.email as string;

        const address=await prisma.address.findFirst({
            where:{id:req.body.addressId,email:email,availability:true}
        });
        if (address===null){
            req.log.warn({addressId:req.body.addressId},"Razorpay create-order rejected: invalid address");
            res.status(400).json({"message":"Invalid address"});
            return;
        }

        // Recompute the authoritative total (paymentMethod Razorpay => no COD surcharge).
        const total=await prisma.$transaction((tx)=>priceAndValidateOrder(tx,{items:req.body.items,storeId:req.body.storeId,amount:req.body.amount,paymentMethod:"Razorpay"}));

        // Create the Razorpay order (amount in paise). If this throws, no local
        // order row is created.
        const rzpOrder=await getRazorpay().orders.create({
            amount: total*100,
            currency: "INR",
            receipt: `rcpt_${Date.now()}`
        });

        const order=await prisma.orders.create({data:{
            amount:total,
            storeId:req.body.storeId,
            email:email,
            description:req.body.description ?? "",
            status:'Unconfirmed',
            addressId:req.body.addressId,
            paymentMethod:'Razorpay',
            paymentStatus:'Pending',
            razorpayOrderId:rzpOrder.id,
            items:{
                create:req.body.items.map((element:Item)=>({itemId:element.id,quantity:element.quantity}))
            }
        }});

        req.log.info({orderId:order.id,razorpayOrderId:rzpOrder.id,amount:total},"Razorpay order created");
        res.json({
            "orderId":order.id,
            "razorpayOrderId":rzpOrder.id,
            "amount":total*100,
            "currency":"INR",
            "keyId":getPublicKeyId()
        });
    }catch(err){
        if (err instanceof OrderError){
            req.log.warn({status:err.status,reason:err.message},"Razorpay create-order rejected");
            res.status(err.status).json({"message":err.message});
            return;
        }
        req.log.error({err},"Unexpected error creating Razorpay order");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

// Verify the signature returned by checkout.js on success. Confirms the order
// (Pending -> Paid) and sends the confirmation email; records Failed otherwise.
userRouter.post("/payment/verify",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let result=verifyPayment.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"INVALID INPUTS"});
        return;
    }
    const email=req.email as string;
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body;
    try{
        if (!verifyPaymentSignature(razorpay_order_id,razorpay_payment_id,razorpay_signature)){
            // Record the failure (only if still pending and owned by this user).
            await prisma.orders.updateMany({
                where:{razorpayOrderId:razorpay_order_id,email:email,paymentStatus:'Pending'},
                data:{paymentStatus:'Failed',razorpayPaymentId:razorpay_payment_id}
            });
            req.log.warn({razorpay_order_id},"Razorpay payment signature verification failed");
            res.status(400).json({"message":"Payment verification failed"});
            return;
        }

        // Valid signature: flip Pending -> Paid. updateMany count tells us if WE
        // performed the transition (vs the webhook getting there first) so the
        // confirmation email is sent exactly once.
        const updated=await prisma.orders.updateMany({
            where:{razorpayOrderId:razorpay_order_id,email:email,paymentStatus:'Pending'},
            data:{paymentStatus:'Paid',razorpayPaymentId:razorpay_payment_id}
        });

        const order=await prisma.orders.findFirst({
            where:{razorpayOrderId:razorpay_order_id,email:email},
            include:{address:true}
        });
        if (order===null){
            res.status(404).json({"message":"Order not found"});
            return;
        }

        if (updated.count===1){
            sendOrderConfirmationEmail(
                email,
                order.id,
                order.amount,
                order.address.houseStreet + " , " + order.address.state + " , " + order.address.pincode,
                order.creationDate.toLocaleDateString()
            ).catch((err)=>req.log.error({err,orderId:order.id},"Order confirmation email failed"));
        }

        req.log.info({orderId:order.id},"Razorpay payment verified");
        res.json({"message":"Payment verified","orderId":order.id});
    }catch(err){
        req.log.error({err},"Unexpected error verifying Razorpay payment");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

// Best-effort marker when the user dismisses the checkout modal without paying.
// The webhook (payment.failed) is the authoritative source; this just keeps the
// DB tidy quickly.
userRouter.post("/payment/failed",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    const razorpay_order_id=req.body?.razorpay_order_id;
    if (typeof razorpay_order_id!=="string"){
        res.status(400).json({"message":"INVALID INPUTS"});
        return;
    }
    const email=req.email as string;
    try{
        await prisma.orders.updateMany({
            where:{razorpayOrderId:razorpay_order_id,email:email,paymentStatus:'Pending'},
            data:{paymentStatus:'Failed'}
        });
        res.json({"message":"Marked failed"});
    }catch(err){
        req.log.error({err},"Unexpected error marking Razorpay payment failed");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.put("/editreview",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let rev_id:number=parseInt(req.query.reviewId as string);
    let email:string=req.email as string;
    if (Number.isNaN(rev_id)){
        res.status(400).json({"message":"Invalid id"});
        return;
    }
    let result=editreview.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
    }
    try{
        // Only allow explicitly whitelisted, validated fields — never spread req.body.
        const data:{rating?:number;description?:string}={};
        if (result.data.rating!==undefined) data.rating=result.data.rating;
        if (result.data.description!==undefined) data.description=result.data.description;
        let result1=await prisma.reviews.update({
            where:{
                id:rev_id,
                email:email
            },
            data
        });
        res.json({"message":"Review updated successfully","review":result1});
    }catch(err){
        req.log.error({err},"Unexpected error handling request");
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
        // Build the update payload from validated, whitelisted fields only.
        const data:{firstName?:string;lastName?:string;contactNo?:string;password?:string}={
            firstName:result.data.firstName,
            lastName:result.data.lastName,
            contactNo:result.data.contactNo
        };
        if (result.data.password!==undefined){
            data.password=await bcrypt.hash(result.data.password,BCRYPT_ROUNDS);
        }
        let result1=await prisma.users.update({
            where:{
                email:email
            },
            data,
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
        req.log.error({err},"Unexpected error handling request");
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
    if (Number.isNaN(add_id)){
        res.status(400).json({"message":"Invalid id"});
        return;
    }
    try{
        // Only allow explicitly whitelisted, validated fields — never spread req.body.
        const data:{houseStreet?:string;state?:string;pincode?:string}={};
        if (result.data.houseStreet!==undefined) data.houseStreet=result.data.houseStreet;
        if (result.data.state!==undefined) data.state=result.data.state;
        if (result.data.pincode!==undefined) data.pincode=result.data.pincode;
        let result1=await prisma.address.update({
            where:{
                id:add_id,
                email:email,
                availability:true
            },
            data
        });
        res.json({"message":"Address updated successfully","address":result1});
    }catch(err){
        req.log.error({err},"Unexpected error handling request");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.delete("/deleteaddress",authMiddlewareuser,async (req:CustomRequest,res:Response)=>{
    let id:number=parseInt(req.query.id as string);
    let email:string=req.email as string;
    if (Number.isNaN(id)){
        res.status(400).json({"message":"Invalid id"});
        return;
    }
    try{
        await prisma.address.update({
            where:{
                email:email,
                id:id
            },
            data : {
                availability:false
            }
        });
        res.json({"message":"Address removed successfully"});
    }catch(err){
        req.log.error({err},"Unexpected error handling request");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
userRouter.get("/viewmenuitem",async (req:CustomRequest,res:Response)=>{
    let itemId:number=parseInt(req.query.itemId as string);
    if (Number.isNaN(itemId)){
        res.status(400).json({"message":"Invalid id"});
        return;
    }
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
        req.log.error({err},"Unexpected error handling request");
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
        req.log.error({err},"Unexpected error handling request");
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
        let hashedotp = await bcrypt.hash(otp,BCRYPT_ROUNDS);
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
        // console.log("email"+req.body.email);
        // console.log("otp"+otp);
        req.log.info({email:req.body.email},"OTP generated, sending email");
        const sendRes = await sendOTP(req.body.email,otp);
        if (!sendRes.ok){
            req.log.error({email:req.body.email, mailjet:sendRes},"OTP email failed to send");
            // TEMP DEBUG: surface Mailjet's actual reason so the failure can be diagnosed.
            res.status(502).json({"message":"Failed to send OTP, please try again", debug:{status:sendRes.status, detail:sendRes.detail}});
            return;
        }
        req.log.info({email:req.body.email},"OTP sent successfully");
        res.json({"message":"Otp Generated Successfully"});
    }catch(err){
        req.log.error({err},"Unexpected error handling request");
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
        // Always run a real OTP + expiry check. A stale `verified` flag must not
        // bypass verification of a brand-new request.
        let cur=new Date();
        let expiry=result.expirationDate;
        if (expiry<cur){
            req.log.warn({email},"OTP verification failed: expired");
            res.status(400).json({"message":"Otp Expired"});
            return;
        }
        if (await bcrypt.compare(inputotp,result["otp"])){
            await prisma.otpStatus.update({
                where:{
                    id:result.id
                },
                data:{
                    verified:true
                }
            })
            req.log.info({email},"OTP verified successfully");
            res.json({"message":"User Verified Successfully"});
        }
        else{
            req.log.warn({email},"OTP verification failed: invalid code");
            res.status(400).json({"message":"Invalid Otp"})
        }
    }catch(err){
        req.log.error({err},"Unexpected error handling request");
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
        req.log.error({err},"Unexpected error handling request");
        res.status(500).json({"message":"Internal Server Error"})
    }
})