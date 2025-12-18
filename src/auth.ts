import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { getDB } from './db/mongo';
import { ObjectId } from 'mongodb';
import { TRAINER_COLLECTIONS } from './utils';

dotenv.config()




type TokenPayload = {
    userId: string;
}


export const signToken = (userId: string) => {
    const SUPER_SECRETO = process.env.SECRET;
    if(!SUPER_SECRETO){
        throw new Error("no hemos encontrado el secreto del planeta del tesoro capitan")
    }
    return jwt.sign({ userId }, SUPER_SECRETO!, { expiresIn: "1h" });
}


export const verifyToken = (token: string): TokenPayload | null => {
    try{
        const SUPER_SECRETO = process.env.SECRET;
        return jwt.verify(token, SUPER_SECRETO!) as TokenPayload;
    }catch (err){
        return null;
    }
};

export const getUserFromToken = async (token: string) => {
    const payload = verifyToken(token);
    if(!payload) return null;
    const db = getDB();
    return await db.collection(TRAINER_COLLECTIONS).findOne({
        _id: new ObjectId(payload.userId)
    })
}
