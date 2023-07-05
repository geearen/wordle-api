import { NextFunction } from "express";

function logger(req: Request, res: Response, next: NextFunction){
    console.log(`${req.url}: ${req.method} - ${new Date().toLocaleDateString()}`);
    next();
}

export = logger;