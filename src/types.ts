import { ObjectId } from "mongodb"

export type Trainer = {
    _id?: ObjectId,
    name:string,
    password: string
    pokemons?:string[]
}
export type Pokemon = {
    _id?: ObjectId
    name: String
    description: String
    height: number
    weight: number
    types: string[]

}
export type Owned = {
    _id?: ObjectId
    //En base datos se guardará solo el id, encadenado pokemon.
    pokemon: string
    nickname?: string
    attack: number
    defense: number
    speed:number
    special: number
    level: number
    
}