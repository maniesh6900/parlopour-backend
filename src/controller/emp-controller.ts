import { Request, Response } from "express";
import { client } from "../prisma";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResonse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { AdminsingupSchema, CreateTaskSchema, EditTaskSchema } from "../types";
import bcrypt from "bcrypt";

export const Empsingup = asyncHandler(async(req : Request, res : Response)=> {
    const parsedData =  AdminsingupSchema.safeParse(req.body);
    if(!parsedData.success){
        throw new ApiError(411, "data not found");
    }

    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(parsedData.data.password, salt);

    const emp = await client.employee.create({
        data : {
            username : parsedData.data.username,
            password : hashedPassword,
        },
    });
    if(!emp) {
        throw new ApiError(500, "server is having some problems");
    }

    const token = jwt.sign({
        empId : emp.id,
    }, 
        process.env.JWT_SECRET as string,
    );
    res
    .cookie("token", token, {secure : true, httpOnly : true})
    .json(new ApiResponse(200, {emp : emp, token}, "employee created successfully"));
    
});

export const EmpLogin = asyncHandler(async(req : Request, res : Response)=> {
    const parsedData = AdminsingupSchema.safeParse(req.body);
    if(!parsedData.success) {
        throw new ApiError(411, "data not found");
    }

    const emp = await client.employee.findFirst({
        where : {
            username : parsedData.data.username,
        },
    });

    if(!emp) {
        throw new ApiError(411, "admin with this name does not exist");
    }

    
    const isPasswordValid = bcrypt.compareSync(parsedData.data.password, emp.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign({
        empId : emp.id,
    }, 
        process.env.JWT_SECRET as string,
    );

    res
    .cookie("token", token, {secure : true, httpOnly : true})
    .json(
        new ApiResponse(200, {emp : emp , token}, "login succefullt"),
    );

});

export const EmpGetTasks = asyncHandler(async(req : any, res : Response)=> {
    
    const emp  = await client.employee.findFirst({
        where : {

            id : req.user,
        },
    });

    if(!emp) {
        throw new ApiError(401, "please Login again");
    }

    const task = await client.task.findMany({
        where : {
            assignto : emp.username,
        },
    });

    res
    .json(new ApiResponse(200, {task}, "tasks fetched successfully"));


});
