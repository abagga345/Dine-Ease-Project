import {z} from 'zod'

export const UserSignup=z.object({
    username:z.string().min(4,{"message":"Username length is very short"}).max(30,{"message":"Username length is very large"}),
    firstName:z.string({message:"FirstName should be a string"}),
    lastName:z.string({message:"LastName should be a string"}),
    contactNo:z.string().length(10,{"message":"ContactNo not of 10 digits"}),
    password:z.string({message:"Password should be a string"}).min(5,{"message":"Username length is very short"}).max(30,{"message":"Password length is very large"})
}).required()

export const UserSignin=z.object({
    username:z.string().min(4,{"message":"Username length is very short"}).max(30,{"message":"Username length is very large"}),
    password:z.string({message:"Password should be a string"}).min(5,{"message":"Username length is very short"}).max(30,{"message":"Password length is very large"})
}).required()

export const AdminSignup=z.object({
    firstName:z.string(),
    lastName:z.string(),
    username:z.string().min(4).max(30),
    password:z.string().min(5).max(30),
    storeId:z.string().min(4).max(30),
    storeSecret:z.string().min(5).max(30)
}).required()

export const AdminSignin=z.object({
    username:z.string().min(4).max(30),
    password:z.string().min(5).max(30)
}).required()

export const address=z.object({
    houseStreet:z.string().max(60),
    city:z.string().max(30),
    pincode:z.string().min(6).max(7)
}).required()

export const review=z.object({
    rating:z.literal(0).or(z.literal(1)).or(z.literal(2)).or(z.literal(3)).or(z.literal(4)).or(z.literal(5)),
    description:z.string().min(1).max(70),
    itemId:z.number().int()
}).required()

export const additem=z.object({
    imageUrl:z.string().url(),
    amount:z.number().int().min(100).max(5000),
    discount:z.number().int().min(0).max(100),
    details:z.string().max(40),
    visibility:z.boolean()
}).required()

export const status=z.object({
    orderId:z.number().int(),
    status:z.literal("pending").or(z.literal("completed")).or(z.literal("cancelled"))
})

export const item=z.object({
    imageUrl:z.string(),
    title:z.string(),
    amount:z.number().int(),
    discount:z.number().int().optional(),
    details:z.string(),
    visibility:z.boolean().optional(),
})

export const visibility=z.object({
    id:z.number().int(),
    visibility:z.boolean()
})

export const checkout=z.object({
    description:z.string().max(75),
    storeId:z.string(),
    items:z.array(z.object({
        id:z.number().int(),
        quantity:z.number().int()
    })),
    amount:z.number()
})


export const editaddress=z.object({
    houseStreet:z.string().max(60).optional(),
    city:z.string().max(30).optional(),
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