import { Owned, Pokemon, Trainer } from "../types";
import { OWNED_COLLECTIONS, POKEMON_COLLECTIONS, TRAINER_COLLECTIONS } from "../utils";
import { IResolvers } from "@graphql-tools/utils";
import { getDB } from "../db/mongo";
import { createUser, validateUser } from "../collection/users";
import { signToken } from "../auth";
import { crearPokemon, devolverPokemons, pokemonPorId } from "../collection/pokemon";
import { catchPokemon, liberarPokemon } from "../collection/owned";
import { ObjectId } from "mongodb";

export const resolvers: IResolvers = {

    Query:{
        me: async (_, __, { user }) => {
        if (!user) return null;
        return {
            _id: user._id.toString(),
            ...user
            };
        },
        pokemons: async(_, {page, size})=>{
            return await devolverPokemons(page,size)
        },
        pokemon: async(_, {id})=>{
            return await pokemonPorId(id.toString());
        }
    },
    Mutation: {
        startJourney: async(_,{name,password})=>{
            const userId = await createUser(name, password);
            return await signToken(userId);
        },
        login: async(_,{name,password})=>{
            const user = await validateUser(name, password);
            return await signToken(user._id.toString())
        },
        createPokemon: async(_, {name, description, height, weight, types}, {user}) =>{
            return await crearPokemon(name, description, height,weight, types, user)
        },
        freePokemon: async(_, {ownedPokemonId} : {ownedPokemonId: string}, {user}) =>{
            return await liberarPokemon(ownedPokemonId, user)
        },
        catchPokemon: async(_, {pokemonId, nickname} : {pokemonId: string, nickname: string | undefined}, {user})=>{
            return await catchPokemon(pokemonId, user, nickname)
        }
    },
    OwnedPokemon: {
        pokemon: async(parent: Owned)=>{
            const db = getDB();
            const id = parent.pokemon
            const pokemon1 = await db.collection<Pokemon>(POKEMON_COLLECTIONS).findOne({_id: new ObjectId(id)})
            return pokemon1;
        }

    },
    Trainer: {
        pokemons: async(parent: Trainer)=>{
            const db = getDB();
            const arrayIds = parent.pokemons;

            if(!arrayIds) return []
            const arrayObjectsIds = arrayIds.map((n) => new ObjectId(n))

            const arrayOwnedPokemons = await db.collection<Owned>(OWNED_COLLECTIONS).find({_id: {$in: arrayObjectsIds}}).toArray()
            return arrayOwnedPokemons
        }
    }



}