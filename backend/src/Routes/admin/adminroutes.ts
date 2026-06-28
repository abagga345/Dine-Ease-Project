import express from "express"
import { Request,Response} from "express"
import multer from "multer"
import bcrypt from "bcrypt"
import { JWT_SECRET } from "../../config"
import jwt from "jsonwebtoken"
import { authMiddlewareadmin } from "../../Middlewares/authMiddlewareadmin";
import { AdminSignin,status, visibility,additem, AdminSignup } from "../../zodschema/schema";
import { connect } from "./cloudinary";
import { prisma } from "../../prismaClient";

const cloudinary = require("cloudinary").v2;
connect();
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadImageToCloudinary = (
  fileBuffer: Buffer,
  folder: string,
  height?: number,
  quality?: number
): Promise<any> => {
  const options: any = { folder, resource_type: "auto" };
  if (height) options.height = height;
  if (quality) options.quality = quality;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result); // This will return the result of the upload
      }
    );
    uploadStream.end(fileBuffer); // Send the file buffer here
  });
};

const deletePicture = async (imageURL: any) => {
    const segments = imageURL.split("/");
    const fileNameWithExtension = segments[segments.length - 1];

    const publicIdImage = fileNameWithExtension.replace(/\.[^/.]+$/, "");

    
    return cloudinary.uploader.destroy(`default_folder/${publicIdImage}`, {
      type: "upload",
      resource_type: "image",
    });
  };
  

export const adminRouter=express.Router();
interface CustomRequest extends Request{
    email?:string
    storeId?:string
}

//CHECKED
// adminRouter.post("/signin",async (req:Request,res:Response)=>{
//     let result=AdminSignin.safeParse(req.body);
//     if (result["success"]===false){
//         res.status(400).json({"message":"Invalid Inputs"});
//         return;
//     }
//     try{
//         let result1=await prisma.users.findFirst({
//             where:{
//                 email:req.body.email,
//                 role:'Admin'
//             }
//         });
//         if (result1===null){
//             res.status(401).json({"message":"Invalid credentials"});
//             return;
//         }
//         if (!await bcrypt.compare(req.body.password,result1["password"])){
//             res.status(401).json({"message":"Unauthorised "});
//             return;
//         }
//         let token:string=jwt.sign({email:result1["email"],storeId:result1["storeId"]},JWT_SECRET);
//         res.json({"message":"Successful sign in","token":"Bearer "+token});
//     }
//     catch(err){
//         res.status(500).json({"message":"Internal Server Error"});
//     }
// })

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
            },
            select:{
                id:true,
                amount:true,
                status:true,
                email:true,
                creationDate:true,
                description:true,
                paymentMethod:true,
                address:{
                    select:{
                        houseStreet:true,
                        pincode:true,
                        state:true
                    }
                }
            }
        });
        res.json({"orders":result});
    }catch(err){
        req.log.error({err},"Unexpected error handling admin request");
        res.status(500).json({"message":"Internal Server Error"});
    }
})


//CHECKED
adminRouter.get("/vieworderitems",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let orderId=parseInt(req.query.orderId as string);
    if (Number.isNaN(orderId)){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
    }
    try{
        let result=await prisma.orders.findFirst({
            where:{
                id:orderId,
                storeId:req.storeId as string
            },
            select:{
                items:{
                    select:{
                        itemId:true,
                        quantity:true,
                        item:{
                            select:{
                                title:true,
                                amount:true,
                            }
                        }

                    }

                }
            }
        })
        if (result===null){
            res.status(400).json({"message":"Invalid Order Id"});
            return;
        }

        res.json({"message":"Items fetched successfully","items":result["items"]})


    }catch(err){
        req.log.error({err},"Unexpected error handling admin request");
        res.status(500).json({"message":"Internal Server Error"});
    }
})

//CHECKED
adminRouter.get("/unconfirmedorders",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.storeId as string;
    try{
        let result=await prisma.orders.findMany({
            where: {
                storeId: storeId,
                status: {
                  in: ['Unconfirmed', 'Processing', 'Dispatched']
                }
            },
            orderBy:{
                creationDate:"desc"
            },
            select:{
                email:true,
                id:true,
                amount:true,
                description:true,
                status:true,
                creationDate:true,
                paymentMethod:true,
                items:{
                   select:{
                    itemId:true,
                    quantity:true,
                    item:{
                        select:{
                            title:true,
                            amount:true
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
                }
            }
        });
        res.json({"orders":result});
    }catch(err){
        req.log.error({err},"Unexpected error handling admin request");
        res.status(500).json({"message":"Internal Server Error"});
    }
})



//CHECKED
adminRouter.get("/allitems",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.storeId as string;
    try{
        let result1=await prisma.menu.findMany({
            where:{
                storeId:storeId,
                available: true
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
        req.log.error({err},"Unexpected error handling admin request");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
adminRouter.post("/additem",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let result=additem.safeParse(req.body);
    if (result['success']===false){
        // console.log(result["error"]);
        res.status(400).json({"message":"Invalid Item Details"});
        return;
    }
    let storeId:string=req.storeId as string;
    if (!storeId) {
    return res.status(400).json({ message: "Store ID is required" });
    }
    try{
        // Use validated data plus the injected storeId — never raw req.body.
        let result1=await prisma.menu.create({data:{
            imageUrl:result.data.imageUrl,
            title:result.data.title,
            amount:result.data.amount,
            description:result.data.description,
            ...(result.data.visibility!==undefined?{visibility:result.data.visibility}:{}),
            storeId:storeId
        }});
        req.log.info({itemId:result1["id"],storeId},"Menu item created");
        res.json({"message":"Item added successfully","itemId":result1["id"]});
    }catch(err){
        req.log.error({err},"Unexpected error handling admin request");
        res.status(500).json({"message":"Internal Server Error"});
    }
})

//CHECKED
adminRouter.put("/changevisibility",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let storeId:string=req.storeId as string;
    let result=visibility.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Inputs"});
        return;
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
        req.log.error({err},"Unexpected error handling admin request");
        res.status(500).json({"message":"Internal Server Error"});
    }
})

adminRouter.put("/deleteitem", authMiddlewareadmin, async (req: CustomRequest, res: Response) => {
    let storeId=req.storeId;
    
    try {
      let id=parseInt(req.query.id as string);
      if (isNaN(id)){
        res.status(400).json({ message: "Invalid Inputs" });
        return;
      }
      await prisma.menu.updateMany({
        where: {
          id:id,
          storeId: storeId,
        },
        data: {
          available: false,
          visibility: false,
        },
      });

      req.log.info({ itemId: id }, "Menu item soft-deleted");
      return res.json({ message: "Menu Item deleted successfully" });
    } catch (error) {
      req.log.error({ err: error }, "Failed to delete menu item");
        res.status(500).json({ message: "Internal Server Error" });
    }
  });
  

//CHECKED
adminRouter.put("/changestatus",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let result=status.safeParse(req.body);
    if (result["success"]===false){
        res.status(400).json({"message":"Invalid Status"});
        return;
    }
    try{
        const notFound = await prisma.$transaction(async (tx)=>{
            // Read the order inside the tx, scoped to this store, so the
            // status transition and sales adjustment are based on consistent
            // data (no race / double-count).
            const previous=await tx.orders.findFirst({
                where:{
                    id:req.body.orderId,
                    storeId:req.storeId as string
                },
                select:{
                    status:true,
                    amount:true,
                    creationDate:true
                }
            });
            if (previous===null){
                return true;
            }

            const year = previous.creationDate.getFullYear();
            const month = previous.creationDate.getMonth()+1;
            const day = previous.creationDate.getDate();

            await tx.orders.update({
                where:{ id:req.body.orderId },
                data:{ status:req.body.status }
            });

            const becameDelivered = previous.status!="Delivered" && req.body.status=="Delivered";
            const leftDelivered = previous.status=="Delivered" && req.body.status!="Delivered";

            if (becameDelivered){
                await tx.monthlySales.upsert({
                    where: { year_month_day: { year, month , day } },
                    update: { totalSales: { increment: previous.amount } },
                    create: { year, month, day, totalSales: previous.amount }
                });
            }
            else if (leftDelivered){
                // upsert so a missing row never throws; floor at 0 so sales
                // can't go negative.
                const existing = await tx.monthlySales.findUnique({
                    where: { year_month_day: { year, month, day } }
                });
                const current = existing ? existing.totalSales : 0;
                const next = Math.max(0, current - previous.amount);
                await tx.monthlySales.upsert({
                    where: { year_month_day: { year, month, day } },
                    update: { totalSales: next },
                    create: { year, month, day, totalSales: next }
                });
            }
            return false;
        });

        if (notFound){
            req.log.warn({orderId:req.body.orderId},"Status change rejected: order not found for store");
            res.status(400).json({"message":"Invalid Id"});
            return;
        }

        req.log.info({orderId:req.body.orderId,status:req.body.status},"Order status updated");
        res.json({"message":"Status updated successfully"});
    }catch(err){
        req.log.error({err},"Unexpected error handling admin request");
        res.status(500).json({"message":"Internal Server Error"});
    }
})

//CHECKED
adminRouter.get("/totaldaysales",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    const dateobj=new Date();
    let currentYear=dateobj.getFullYear();
    let currentMonth=dateobj.getMonth()+1;
    let currentDay=dateobj.getDate();
    
    try{
        let result=await prisma.monthlySales.findFirst({
            where:{
                month:currentMonth,
                day:currentDay,
                year:currentYear
            }
        })
        if (result===null){
            res.json({"message":"Total day sales fetched successfully",
                totalSales:0
            })
            return;
        }
        res.json({"message":"Total day sales fetched successfully","totalSales":result["totalSales"]});

    }catch(err){
        req.log.error({err},"Unexpected error handling admin request");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }

})

//CHECKED
adminRouter.get("/totalmonthlysales",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    const dateobj=new Date();
    let currentYear=dateobj.getFullYear();
    let currentMonth=dateobj.getMonth()+1; 
    let currentDay=dateobj.getDate();
    try{ 
        let result=await prisma.monthlySales.aggregate({
            where:{
                month:currentMonth,
                year:currentYear
            },
            _sum:{
                totalSales:true
            }
        })
        if (result===null){
            res.json({"message":"Total monthly sales fetched successfully","total":0})
            return;
        }
        res.json({"message":"Total monthly sales fetched successfully","total":result["_sum"]["totalSales"]===null?0:result["_sum"]["totalSales"]})
    }catch(err){
        req.log.error({err},"Unexpected error handling admin request");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
})

//CHECKED
adminRouter.get("/chartdata",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    try{
        let total_sales = await prisma.monthlySales.aggregate({
            _sum: {
              totalSales: true,
            },
          });
        let avg_reviews = await prisma.reviews.aggregate({
            _avg: {
              rating: true,
            },
            _count:{
                id:true
            }
          });
      
        let visible_items = await prisma.menu.aggregate({
            where: {
              visibility: true
            },
            _count: {
              id: true,
            },
        });
        
        let salestable=await prisma.monthlySales.groupBy({
            by: ['month'], // Must be an actual scalar field
            _sum: {
              totalSales: true
            },
            orderBy: {
              month: 'desc'
            }
        });
        res.json({"message":"Chart Data fetched successfully",
            salesData:salestable,
            avgReview:(avg_reviews["_avg"]['rating']===null?0:avg_reviews["_avg"]['rating']),
            visibleCount:(visible_items["_count"]["id"]===null?0:visible_items["_count"]["id"]),
            totalSales:(total_sales["_sum"]["totalSales"]===null?0:total_sales["_sum"]["totalSales"]),
            totalReviews:(avg_reviews["_count"]['id']===null?0:avg_reviews["_count"]['id'])
        })
    }catch(err){
        req.log.error({err},"Unexpected error handling admin request");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
});

//CHECKED
adminRouter.get("/ordercounts",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    try{
        let result=await prisma.orders.groupBy({
            by:['status'],
            _count:{
                id:true
            }
        })
        res.json({"message":"Order counts fetched successfully ",orderCounts:result});
    }catch(err){
        req.log.error({err},"Unexpected error handling admin request");
        res.status(500).json({"message":"INTERNAL SERVER ERROR"});
    }
});


//CHECKED
// adminRouter.post("/signup",async (req:Request,res:Response)=>{
//     let result=AdminSignup.safeParse(req.body);
//     if (result["success"]==false){
//         res.status(400).json({"message":"Invalid Inputs"});
//         return;
//     }
//     try{
//         let result1=await prisma.store.findFirst({where:{storeId:req.body.storeId}});
//         if (result1===null){
//             res.status(400).json({"message":"Invalid Store"});
//             return;
//         }
//         let result2=await prisma.users.findFirst({where:{email:req.body.email}});
//         if (result2!==null){
//             res.status(400).json({"message":"User already exists"});
//             return;
//         }
//         let temp=await bcrypt.hash(req.body.password,5);
//         await prisma.users.create({
//             data:{
//                 firstName:req.body.firstName,
//                 lastName:req.body.lastName,
//                 email:req.body.email,
//                 password:temp,
//                 storeId:req.body.storeId,
//                 role:'Admin',
//                 contactNo:req.body.contactNo
//             }
//         });
//         let token=jwt.sign({email:req.body.email,storeId:req.body.storeId},JWT_SECRET);
//         res.json({"message":"Successful sign up","token":"Bearer "+token});
//     }catch(err){
//         // console.log(err);
//         res.status(500).json({"message":"Internal Server Error"});
//     }
// })

//CHECKED
adminRouter.get("/viewprofile",authMiddlewareadmin,async (req:CustomRequest,res:Response)=>{
    let email:string=req.email as string;
    let storeId:string=req.storeId as string;
    try{
        let result=await prisma.users.findFirst({
            where:{
                "email":email,
                "storeId":storeId
            },
            select:{
                firstName:true,
                lastName:true,
                contactNo:true,
                email:true,
                role:true,
                storeId:true,
                store:{
                    select:{
                        storeStreet:true,
                        state:true,
                        pincode:true
                    }
                }
            }
        })
        if (result===null){
            throw new Error();
        }
        res.json({"message":"Profile fetched successfully",
            "firstName":result["firstName"],
            "lastName":result["lastName"],
            "contactNo":result["contactNo"],
            "email":result["email"],
            "storeId":result["storeId"],
            "role":result["role"],
            "store":result["store"]
        })
    }catch(err){
        req.log.error({err},"Unexpected error handling admin request");
        res.status(500).json({"message":"Internal Server Error"})
    }
})


//NOT CHECKED
adminRouter.post(
    "/imageupload",
    authMiddlewareadmin,
    upload.single("file"), // Expecting a file field with name 'file'
    async (req: any, res: Response) => {
      try {
        const file = req.file;
        const { folder = "default_folder", height, quality } = req.body;
  
        if (!file) {
          return res.status(400).json({ message: "File is required" });
        }
  
        const fileBuffer = file.buffer;
  
        const uploadResult = await uploadImageToCloudinary(
          fileBuffer,
          folder,
          height,
          quality
        );
  
        req.log.info({ url: uploadResult.secure_url }, "Image uploaded to Cloudinary");
        return res.json({
          message: "Image uploaded successfully",
          url: uploadResult.secure_url,
        });
      } catch (error) {
        req.log.error({ err: error }, "Cloudinary image upload failed");
        return res.status(500).json({ message: "Upload failed" });
      }
    }
  );
  

  // NOT CHECKED
  adminRouter.delete(
    "/deleteimage",
    authMiddlewareadmin,
    async (req: Request, res: Response) => {
      try {
        const { file } = req.body;
  
        if (!file) {
          return res.status(400).json({ message: "File is required" });
        }
  
        await deletePicture(file);

        req.log.info("Image deleted from Cloudinary");
        return res.json({ message: "Image Deleted Successfully" });
      } catch (error) {
        req.log.error({ err: error }, "Cloudinary image delete failed");
        return res.status(500).json({ message: "Delete failed" });
      }
    }
  );



// ROUTE FOR IMAGE UPLOAD



// ROUTE FOR IMAGE DELETION