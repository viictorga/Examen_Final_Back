import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import bcrypt from "bcryptjs";
import { Trainer } from "../types";
import {TRAINER_COLLECTIONS} from "../utils"




export const createUser = async ( name: string, password: string) => {
    const db = getDB();
    const toEncriptao = await bcrypt.hash(password, 10);
    const buscar = await db.collection(TRAINER_COLLECTIONS).findOne({name: name})
    if(!buscar) throw new Error("no se pueden crear dos trainers con el mismo nombre")
    const result = await db.collection<Trainer>(TRAINER_COLLECTIONS).insertOne({
        name,
        password: toEncriptao,
        pokemons: []
    });

    return result.insertedId.toString();
}

export const validateUser = async (name: string, password: string) => {
    const db = getDB();
    const user = await db.collection(TRAINER_COLLECTIONS).findOne({name});
    if( !user ) throw new Error("No existe ningun usuario con ese email");

    const laPassEsLaMismaMismita = await bcrypt.compare(password, user.password);
    if(!laPassEsLaMismaMismita) throw new Error("Contraseña Incorrecta");

    return user;
};


export const findUserById = async (id: string) => {
    const db = getDB();
    return await db.collection(TRAINER_COLLECTIONS).findOne({_id: new ObjectId(id)})
}