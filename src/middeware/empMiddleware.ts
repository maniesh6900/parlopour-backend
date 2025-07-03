import { NextFunction, Request, request } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt from "jsonwebtoken";

export const empMiddleware = asyncHandler(async (req : Request | any, _  : Response, next : NextFunction)=> {
    // const header = req.headers["authorization"] ?? "";
    // const token = header?.split(" ")[1];
    const {token} = req.cookies;

    if(!token) {
        throw new ApiError(411,  "Unauthorized");
    }

    const decorded = jwt.verify(token, process.env.JWT_SECRET as string);
    if(!decorded) {
        throw new ApiError(400, "token has failed please login again and retry");
    }
    
    // @ts-ignore
    if(decorded.empId) {
        // @ts-ignore
        req.user = decorded.empId;
        next();
    }else {
        throw new ApiError(400, "You are not logged in");
    }

});