import { paymentMethods } from '@prisma/client'
import {z} from 'zod'

export const UserSignup=z.object({
    email:z.string().min(4,{"message":"Email length is very short"}).max(30,{"message":"Email length is very large"}),
    firstName:z.string({message:"FirstName should be a string"}),
    lastName:z.string({message:"LastName should be a string"}),
    contactNo:z.string().length(10,{"message":"ContactNo not of 10 digits"}),
    password:z.string({message:"Password should be a string"}).min(5,{"message":"Email length is very short"}).max(30,{"message":"Password length is very large"})
}).required()

export const AdminSignup=z.object({
    email:z.string().min(4,{"message":"Email length is very short"}).max(30,{"message":"Email length is very large"}),
    firstName:z.string({message:"FirstName should be a string"}),
    lastName:z.string({message:"LastName should be a string"}),
    contactNo:z.string().length(10,{"message":"ContactNo not of 10 digits"}),
    password:z.string({message:"Password should be a string"}).min(5,{"message":"Email length is very short"}).max(30,{"message":"Password length is very large"}),
    storeId:z.string().max(50)
}).required()

export const UserSignin=z.object({
    email:z.string().min(4,{"message":"Email length is very short"}).max(100,{"message":"Email length is very large"}),
    password:z.string({message:"Password should be a string"}).min(5,{"message":"Email length is very short"}).max(30,{"message":"Password length is very large"})
}).required()

export const AdminSignin=z.object({
    email:z.string().min(4).max(30),
    password:z.string().min(5).max(30)
}).required()

export const address=z.object({
    houseStreet:z.string().max(60),
    state:z.string().max(30),
    pincode:z.string().min(6).max(7)
}).required()

export const review=z.object({
    rating:z.literal(0).or(z.literal(1)).or(z.literal(2)).or(z.literal(3)).or(z.literal(4)).or(z.literal(5)),
    description:z.string().min(1).max(70),
    itemId:z.number().int()
}).required()

export const additem=z.object({
    imageUrl:z.string().url(),
    title:z.string().max(60),
    amount:z.number().int().min(100).max(5000),
    description:z.string().max(200),
    visibility:z.boolean().optional()
})

export const status=z.object({
    orderId:z.number().int(),
    status:z.literal("Unconfirmed").or(z.literal("Rejected")).or(z.literal("Processing")).or(z.literal("Delivered")).or(z.literal("Dispatched"))
})

// export const item=z.object({
//     imageUrl:z.string(),
//     title:z.string(),
//     amount:z.number().int(),
//     description:z.string(),
//     visibility:z.boolean().optional(),
// })

export const visibility=z.object({
    id:z.number().int(),
    visibility:z.boolean()
})

export const deleteitem=z.object({
    id:z.number().int(),
})

export const checkout=z.object({
    description:z.string().max(75).optional(),
    storeId:z.string(),
    items:z.array(z.object({
        id:z.number().int(),
        quantity:z.number().int().min(1, { message: 'Quantity must be a positive integer' })
    })),
    amount:z.number(),
    addressId:z.number(),
    paymentMethod:z.literal("COD").or(z.literal("UPI")).or(z.literal("StorePayment"))
})


export const editaddress=z.object({
    houseStreet:z.string().max(60).optional(),
    state:z.string().max(30).optional(),
    pincode:z.string().min(6).max(7).optional()
})

export const editUser=z.object({
    firstName:z.string().optional(),
    lastName:z.string().optional(),
    ContactNo:z.string().length(10).optional(),
    password:z.string().min(5).max(30).optional()
})

export const editreview=z.object({
    rating:z.literal(0).or(z.literal(1)).or(z.literal(2)).or(z.literal(3)).or(z.literal(4)).or(z.literal(5)).optional(),
    description:z.string().min(1).max(70).optional(),
})