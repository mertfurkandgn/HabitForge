import { Response } from 'express';

export function success(res:Response,data:unknown,statusCode=200){
    res.status(statusCode).json({
        success:true,
        data:data
    })
}

export function error(res: Response, message: string, code: string, statusCode: number) {
    res.status(statusCode).json({
    success:false,
    error:{message,code}
})
}