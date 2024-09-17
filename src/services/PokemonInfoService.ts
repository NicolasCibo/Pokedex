import axios from "axios";
import { MovesInfoSchema, AbilitiesInfoSchema, PokemonMovesAndAbilitiesURL ,PokemonInfoSchema, EvosAndFormsURL, EvolutionChainSchema } from "../schemas/pokemon-info-schema";
import { PokemonDetailedInfo } from "../types";

export async function getPokemonMovesAndAbilitiesURL(id : PokemonDetailedInfo['id']) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}` 
    const { data } = await axios(url)
    const result = PokemonMovesAndAbilitiesURL.safeParse(data)
    if (result.success) {
        return result.data
    }   
}

export async function getMovesInfo(url: string) {
    try {
        const { data } = await axios(url)
        const result = MovesInfoSchema.safeParse(data)
        if(result.success){
            return result.data
        }
    }catch{
        return null
    } 
}

export async function getAbilitiesInfo(url: string) {
    try {
        const { data } = await axios(url)
        const result = AbilitiesInfoSchema.safeParse(data)
        if(result.success){
            return result.data
        }
    }catch{
        return null
    } 
}

export async function getEvosAndFormsURL(id : PokemonDetailedInfo['id']) {
    const url = `https://pokeapi.co/api/v2/pokemon-species/${id}` 
    const { data } = await axios(url)
    const result = EvosAndFormsURL.safeParse(data)
    if (result.success) {
        return result.data
    }   
}

export async function getEvoInfo(url: string) {
    try {
        const { data } = await axios(url)
        const result = EvolutionChainSchema.safeParse(data)
        if(result.success){
            return result.data
        }
    }catch{
        return null
    } 
}

export async function getFormInfo(url: string) {
    try {
        const { data } = await axios(url)
        const result = PokemonInfoSchema.safeParse(data)
        if(result.success){
            return result.data
        }
    }catch{
        return null
    } 
}

export async function getAnotherEvosAndFormsURL(url: string) {
    try {
        const { data } = await axios(url)
        const result = EvosAndFormsURL.safeParse(data)
        if(result.success){
            return result.data
        }
    }catch{
        return null
    } 
}

export async function getPokemonDetailedInfo(id : PokemonDetailedInfo['id']) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}` 
    const { data } = await axios(url)
    const result = PokemonInfoSchema.safeParse(data)
    if (result.success) {
        return result.data
    }   
}