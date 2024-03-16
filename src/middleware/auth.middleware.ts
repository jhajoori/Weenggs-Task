import jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express";
import { createErrorResponse, createInternalServerErrorResponse } from '../helper/response.helper';
import * as dotenv from 'dotenv'
import { AppDataSource } from '../datasource';
import { User } from '../entity/user.entity';
dotenv.config()

const UserRepository = AppDataSource.getRepository(User);

export const authMiddleware = async (req : Request, res:Response, next : NextFunction) => {
    try {
        const auth = req.header('Authorization');
        const token = auth?.split(' ')[1];

        if(!token){
            return res.status(403).json(createErrorResponse("UnAuthorized","No token found!"))
        }
        
       await jwt.verify(token, process.env.SECRET, async (error, data: any) => {

            if (error) {
                return res.status(403).json(createErrorResponse("UnAuthorized", "Invalid Token!"));
            }
            else {
                const user = await UserRepository.findOneBy({ id: data.id });

                res.locals.token = user;
            }


        })

        next()

    } catch (error) {
        console.log("error ==> ",error)
    return res.status(500).json(createInternalServerErrorResponse())
        
    }
}