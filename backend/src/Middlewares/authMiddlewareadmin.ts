import express from "express"
import { Request,Response,NextFunction } from "express"
import { JWT_SECRET } from "../config"
import  jwt from "jsonwebtoken";
interface CustomRequest extends Request{
    username?:string
    storeId?:string
}
export function authMiddlewareadmin(req:CustomRequest,res:Response,next:NextFunction){
    let token:string|undefined=req.headers.authorization;
    try{
        if (!token) throw Error;
        let tokenstring:string=token.split(' ')[1];
        let result=jwt.verify(tokenstring,JWT_SECRET) as {username:string,storeId:string};
        req.username=result.username;
        req.storeId=result.storeId;
        next();
    }catch(err){
        res.status(401).json({"message":"Unauthorized"})
    }
}