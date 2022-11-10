import { NextFunction, Request, Response } from "express"

const headers = (req: Request, res: Response, next: NextFunction) => {
    console.log('headers')
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader("Access-Control-Allow-Origin", `http://localhost:3000`);
    res.setHeader("Access-Control-Allow-Methods", 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
};

export default headers