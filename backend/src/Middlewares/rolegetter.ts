import express from "express"
import { Request,Response,NextFunction } from "express"
import { JWT_SECRET } from "../config"
import  jwt from "jsonwebtoken";

export function rolegetter(req:Request,res:Response,next:NextFunction){
    let token:string|undefined=req.headers.authorization;
    try{
        if (!token) throw Error;
        let tokenstring:string=token.split(' ')[1];
        let result=jwt.verify(tokenstring,JWT_SECRET) as {
            storeId?:number;
            email:number;
        };
        let tempVerified=true,tempRole='User';
        if (result.storeId!==undefined){
            tempRole='Admin';
        }
        res.json({"message":"Role checked successfully",
            role:tempRole,
            verified:tempVerified
        })
    }catch(err){
        res.status(401).json({"message":"Unauthorized",role:"",verified:false})
    }
}