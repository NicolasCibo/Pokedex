import axios from "axios";
import { PokemonURLAPIResponseSchema, PokemonMainInfoSchema, FilterTypeAPIResponseSchema } from "../schemas/pokedex-schema";

export async function getPokemonURL(limit : number, offset : number) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}` 
    const { data } = await axios(url);
    const result = PokemonURLAPIResponseSchema.safeParse(data)
    if (result.success) {
        return result.data.results.map(pokemon => ({
            name: pokemon.name,
            url: pokemon.url
        }))
    }   
}

export async function getPokemonList(url : string){
    const {data} = await axios(url)
    const result = PokemonMainInfoSchema.safeParse(data)
    if(result.success){
        return result.data
    }
}

export async function getPokemonByType(type : string){
    const url = `https://pokeapi.co/api/v2/type/${type}`
    const {data} = await axios(url)
    const result = FilterTypeAPIResponseSchema.safeParse(data)
    if(result.success){
        const urls = result.data.pokemon.map(poke => poke.pokemon.url)
        return urls
    }
}

