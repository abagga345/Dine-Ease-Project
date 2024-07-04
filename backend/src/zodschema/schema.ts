import {z} from 'zod'

export const UserSignup=z.object({
    username:z.string().min(4).max(30),
    firstName:z.string(),
    lastName:z.string(),
    ContactNo:z.number().min(6000000000).max(9999999999),
    password:z.string().min(5).max(30)
}).required()

export const UserSignin=z.object({
    username:z.string().min(4).max(30),
    password:z.string().min(5).max(30)
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
    pincode:z.number().int().min(110000).max(999999)
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

//visibility
//status
//checkout
//edit profile