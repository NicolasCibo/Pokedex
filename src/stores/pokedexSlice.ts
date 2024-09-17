import { StateCreator } from "zustand"
import { getPokemonByType, getPokemonList, getPokemonURL } from "../services/PokedexService"
import { createNotificationSlice, NotificationSliceType } from "./notificationSlice"
import { MyteamSliceType } from "./myteamSlice"
import { PokeURL } from "../types"
import { pokemonData } from "../data/pokemonData"

export type PokedexSliceType = {
    pokemonList: PokeURL[]
    pokemonListAll: PokeURL[]
    pokemonListFiltered: PokeURL[]
    loading: boolean
    filterType: string
    filterName: string
    maxNumPokemon: number
    appTitle: string
    fetchPokemonList: (limit : number, offset : number) => Promise<void>
    fetchFilterPokemonListByType: (filterType : string) => Promise<void>
    filterPokemonListByName: (pokeName : string) => void
    loadMorePokemonList: (limit : number, offset : number) => Promise<void> 
    upgradeAppTitle: (title : string) => void
}

export const createPokedexSlice : StateCreator<PokedexSliceType & NotificationSliceType & MyteamSliceType, [], [], PokedexSliceType> = (set, get, api) => ({
    pokemonList: [] as PokeURL[],
    pokemonListAll: [] as PokeURL[],
    pokemonListFiltered: [] as PokeURL[],
    loading: false,
    filterType: '',
    filterName: '',
    maxNumPokemon: 1024,
    appTitle: '',
    fetchPokemonList: async(limit, offset) => {
        const responseURL = await getPokemonURL(limit, offset)
        if(responseURL){
            const promises = responseURL.map(pokemon => getPokemonList(pokemon.url)).filter(pokemon => pokemon !== undefined && pokemon !== null)
            const responses = await Promise.allSettled(promises)

            const responseList: PokeURL[] = responses
                .filter((result): result is PromiseFulfilledResult<PokeURL> => result.status === 'fulfilled')
                .map(result => result.value)     
            set({
                pokemonList : responseList,
                pokemonListAll : responseList,
                pokemonListFiltered : responseList
            })
        }
    },
    fetchFilterPokemonListByType: async(filterType) => {
        const response = await getPokemonByType(filterType)
        if(response){
            const promises = response.map(url => getPokemonList(url))
            const responses = await Promise.allSettled(promises)

            const filteredList : PokeURL[] = responses
                .filter((result): result is PromiseFulfilledResult<PokeURL> => result.status === 'fulfilled')
                .map(result => result.value)
                .filter(pokemon => pokemon !== undefined && pokemon.id < 10000)
            set({
                pokemonList: filteredList,
                pokemonListFiltered : filteredList,
                filterType : filterType
            })
        }else{
            set({
                pokemonListFiltered : get().pokemonListAll,
                pokemonList : get().pokemonListAll,
                filterType : ''
            })
        }
    },
    filterPokemonListByName: async (pokeName) => {
        if(pokeName.length > 2){
            const filteredList = pokemonData.filter(pokemon => pokemon.name.includes(pokeName.toLowerCase()))
            const promises = filteredList.map(pokemon => getPokemonList(pokemon.url)).filter(pokemon => pokemon !== undefined && pokemon !== null)
            const responses = await Promise.allSettled(promises)

            const responseList: PokeURL[] = responses
                .filter((result): result is PromiseFulfilledResult<PokeURL> => result.status === 'fulfilled')
                .map(result => result.value)

            set({
                pokemonListFiltered : responseList,
                filterName : pokeName
            })
        }else if(pokeName.length === 0){
            set({
                pokemonListFiltered : get().pokemonList,
                filterName : pokeName
            })
        }else{
            createNotificationSlice(set, get, api).showNotification({
                text: `The Pokémon's name must have at least 3 letters.`,
                error: true
            })
        }
        
    },
    loadMorePokemonList: async(limit, offset) => {
        set({loading: true})
        try{
            const responseURL = await getPokemonURL(limit, offset)
            if(responseURL){
                const promises = responseURL.map(pokemon => getPokemonList(pokemon.url))
                const responses = await Promise.allSettled(promises)

                const responseList: PokeURL[] = responses
                    .filter((result): result is PromiseFulfilledResult<PokeURL> => result.status === 'fulfilled')
                    .map(result => result.value)
                set((state)=> ({
                    pokemonList: [...state.pokemonList, ...responseList],
                    pokemonListAll: [...state.pokemonListAll, ...responseList],
                    pokemonListFiltered: [...state.pokemonListFiltered, ...responseList]
                }))
            }
        }finally{
            set({loading: false})
        }  
    },
    upgradeAppTitle: (title) => {
        set({appTitle: title})
    }
})