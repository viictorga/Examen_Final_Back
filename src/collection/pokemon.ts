import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import { Pokemon, Trainer } from "../types";
import {POKEMON_COLLECTIONS, TRAINER_COLLECTIONS} from "../utils"


export const devolverPokemons = async(page?: number, size?: number)=>{
    page = page || 1;
    size = size || 10;
    const db = getDB();
    return await db.collection(POKEMON_COLLECTIONS).find().skip((page-1) * size).limit(size).toArray()
}
export const pokemonPorId = async(id:string)=>{
    const db = getDB();
    const a = db.collection(POKEMON_COLLECTIONS).findOne({_id: new ObjectId(id)})
    if(!a) return null;
    return a;
}
export const crearPokemon = async(name: string, description: string, height: number, weight: number, types: string[], user: Trainer)=>{
    if(!user) throw new Error("no estas autenticado para crear el pokemon")
    const db = getDB();

    const nuevoPokemon: Pokemon = {
        name,
        description,
        height,
        weight,
        types
    }
    const insertado = await db.collection(POKEMON_COLLECTIONS).insertOne(nuevoPokemon)
    return await db.collection(POKEMON_COLLECTIONS).findOne({_id: insertado.insertedId})
}