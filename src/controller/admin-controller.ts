import { Request, Response } from "express";
import { client } from "../prisma";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResonse";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from "jsonwebtoken";
import { AdminsingupSchema, CreateTaskSchema, EditTaskSchema } from "../types";
import bcrypt from "bcrypt";

export const Adminsingup = asyncHandler(async(req : Request, res : Response)=> {
    const parsedData =  AdminsingupSchema.safeParse(req.body);
    if(!parsedData.success){
        throw new ApiError(411, "data not found");
    }

    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(parsedData.data.password, salt);

    const admin = await client.admin.create({
        data : {
            username : parsedData.data.username,
            password : hashedPassword,
        },
    });
    if(!admin) {
        throw new ApiError(500, "server is having some problems");
    }

    const token = jwt.sign({
        adminId : admin.id,
    }, 
        process.env.JWT_SECRET as string,
    );
    res
    .cookie("token", token, {secure : true, httpOnly : true})
    .json(new ApiResponse(200, {admin : admin, token}, "admin created successfully"));
    
});

export const AdminLogin = asyncHandler(async(req : Request, res : Response)=> {
    const parsedData = AdminsingupSchema.safeParse(req.body);
    if(!parsedData.success) {
        throw new ApiError(411, "data not found");
    }

    const admin = await client.admin.findFirst({
        where : {
            username : parsedData.data.username,
        },
    });

    if(!admin) {
        throw new ApiError(411, "admin with this name does not exist");
    }

    
    const isPasswordValid = bcrypt.compareSync(parsedData.data.password, admin.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const token = jwt.sign({
        adminId : admin.id,
    }, 
        process.env.JWT_SECRET as string,
    );

    res
    .cookie("token", token, {secure : true, httpOnly : true})
    .json(
        new ApiResponse(200, {admin : admin , token}, "login succefullt"),
    );

});

export const CreateTask = asyncHandler(async(req : any, res : Response)=>{
    const parsedData = CreateTaskSchema.safeParse(req.body);
    if(!parsedData.success) {
        throw new ApiError(406, "data not found");
    }

    const  user = await client.employee.findFirst({
        where : {
            username : parsedData.data.assinedTo, 
        },
    });

    if(!user ) {
        throw new ApiError(411, "user with this username not found");
    }

    const task = await client.task.create({
        data : {
            title : parsedData.data.title,
            description : parsedData.data.description,
            assignto : parsedData.data.assinedTo,
            adminId : req.user,
        },
    });

    if(!task) {
        throw new ApiError(500, "server is having some problems");
    }
    res
    .json(
        new ApiResponse(200, task, "new task created succefully"),
    );
});

export const GetTask = asyncHandler(async(req : any, res : Response)=>{

    const tasks = await client.task.findMany({
        where : {
            adminId : req.adminId,
        },
    });

    if(!tasks) {
        throw new ApiError(500, "server is having some problems");
    }
    res
    .json(
        new ApiResponse(200, tasks, " tasks fatched succefully"),
    );
});

export const DeleteTask = asyncHandler(async(req : any, res : Response)=>{
    const parsedData = req.body;
    if(!parsedData) {
        throw new ApiError(411, "data not found");
    }
    const task = await client.task.delete({
        where : {
            id : parsedData.id, 
        },
    });

    res.json(
        new ApiResponse(200, task, "task deleted successfully")
    )
    

    
});

export const EditTask = asyncHandler(async(req : any, res : Response)=>{
    const parsedData = EditTaskSchema.safeParse(req.body);
    if(!parsedData.success) {
        throw new ApiError(411, "data not found");
    }
    const task = await client.task.update({
        where : {
            id : parsedData.data?.id, 
        },
        data : {
            title : parsedData.data.title,
            description : parsedData.data.description,
            assignto : parsedData.data.assignto,
        },
    });


    

    
});


