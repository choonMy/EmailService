import config from '../config'
import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken } from '../interfaces/auth.interface';
import { User } from '../interfaces/user.interface'
import logger from '../loaders/logger'
import DB from '../db';
const db = DB.instance

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const Authorization = req.cookies['Authorization'] || req?.header('Authorization')?.split('Bearer ')[1] || null;
        //logger.info(Authorization)
        if (!Authorization) {
            next(new HttpException(404, 'Authentication token missing'));
            return
        }

        try {
            const secretKey: string = config.jwtSecret || ''
            const verificationResponse = (await jwt.verify(Authorization, secretKey)) as DataStoredInToken;
            const user: User = {
                id: verificationResponse.id,
                email: verificationResponse.email
            }
            req.user = user
        } catch (err) {
            next(new HttpException(404, 'Invalid authentication token'));
            return
        }

        const user = db('admin_user')
            .where({
                id: req.user.id,
                email: req.user.email
            })
            .select('id')
            .first();

        if (!user) {
            next(new HttpException(403, 'Forbidden'));
            return
        }

        next();
    } catch (error) {
        logger.error(error)
        next(new HttpException(401, 'Wrong authentication token'));
    }
};

export default authMiddleware;
