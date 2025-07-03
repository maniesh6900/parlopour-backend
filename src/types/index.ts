import z from "zod";

export const AdminsingupSchema = z.object({
    username : z.string().min(3),
    password : z.string(),
})

export const  CreateTaskSchema = z.object({
    title : z.string(),
    description : z.string(),
    assinedTo : z.string(),
});

export const  EditTaskSchema = z.object({
    id : z.string(),
    assignto : z.string(),
    title : z.string(),
    description : z.string(),
});

