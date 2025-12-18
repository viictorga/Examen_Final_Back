import { ObjectId } from "mongodb";
import { getDB } from "../db/mongo";
import { Owned, Pokemon, Trainer } from "../types";
import {OWNED_COLLECTIONS, POKEMON_COLLECTIONS, TRAINER_COLLECTIONS} from "../utils"



export const catchPokemon = async (pokemonId: string,user: Trainer, nickname?: string) => {
  if(!user) throw new Error("No encuentro el token, put0graphql que no tiene opcion de copiarlo");
  const db = getDB();
  nickname = nickname || ""
  const trainer = await db.collection(TRAINER_COLLECTIONS).findOne({ _id: new ObjectId(user._id) });
  if(!trainer) throw new Error("no hay trainer chaval");
  if(trainer.pokemons.length >= 6)throw new Error("son 6 capitaaaan, no te pases");
  
  const pokemon = await db.collection(POKEMON_COLLECTIONS).findOne({ _id: new ObjectId(pokemonId) });
  if (!pokemon) throw new Error("no puedes capturar algo que no existe, toreto");
  const idEnString : string = pokemon._id.toString()
  const ownedPokemon : Owned = {
    pokemon: idEnString, // tendran que tener el mismo id digo yo, por eso hago esto, 
    nickname,
    attack: getRandomInt(1, 10),
    defense: getRandomInt(1, 10),
    speed: getRandomInt(1, 10),
    special: getRandomInt(1, 10),
    level: getRandomInt(1, 10),
  };

  const a = await db.collection(OWNED_COLLECTIONS).insertOne(ownedPokemon);
  const arrayTrainer = user.pokemons
  arrayTrainer?.push(idEnString);
  await db.collection(TRAINER_COLLECTIONS).updateOne({ _id: new ObjectId(user._id) },{ $set: { pokemons: arrayTrainer} });

  return await db.collection(OWNED_COLLECTIONS).findOne({_id: new ObjectId(user._id)})
}

export const liberarPokemon = async(id: string, user: Trainer)=>{
    if(!user) throw new Error("No encuentro el token, put0graphql que no tiene opcion de copiarlo");

    const db = getDB();
    const pokesConObject = user.pokemons!.map((n)=> new ObjectId(n))

    const pokemon = await db.collection(OWNED_COLLECTIONS).findOne({_id: {$in: pokesConObject}})
    if(!pokemon) throw new Error("no puedes borrar el poke porque no es tuyo capitan")
    await db.collection(OWNED_COLLECTIONS).deleteOne({_id: new ObjectId(id)})
    const misNuevosPokes = user.pokemons!.filter((n)=> n !== id) // esto es un array con todos menos con el "eliminado"
    await db.collection(TRAINER_COLLECTIONS).updateOne({_id: user._id}, {$set: {pokemons: misNuevosPokes}})
    return await db.collection(TRAINER_COLLECTIONS).findOne({_id: user._id})

}

function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

