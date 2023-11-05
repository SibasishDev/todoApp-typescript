import { Response } from "express";
export const errorResponse = (error: any, req: any, res: Response, next: any) => {

    console.log(error,"=====");
    res.status(error.code || 500).json({
        code : error.code || 500,
        message : error.message || "Internal server Error!"
    })
}

export const successResponse = (res :Response, status : number, message : string, data : any = null) => {
    const responseData : any = {
        code : status,
        message : message
    };

    if(data) responseData.data = data;
    
    res.status(status).json(responseData);
};