import { NextFunction, Request, Response } from "express"

export const asyncHandler = (promiseHandler: Function) => {
    return (req : Request, res : Response, next : NextFunction)=> {
        Promise.resolve(promiseHandler(req, res, next)).catch(next)
    }
}