import { Response } from "express";
export const errorResponse = (error : any, res : Response) => {
    res.status(error.code || 500).json({
        code : error.code || 500,
        message : error.message || "Internal server Error!"
    })
}

export const successResponse = (res :Response, status : number, message : string, data : any) => res.status(status).json({code : status, message : message, data : data});