import { StateCreator } from "zustand"
import { PokemonDetailedInfo, MyTeamPokemonDetailedInfo } from "../types"
import { createNotificationSlice, NotificationSliceType } from "./notificationSlice"
import { PokedexSliceType } from "./pokedexSlice"
import { createPokemonInfoSlice, PokemonInfoSliceType } from "./pokemonInfoSlice"
import { v4 as uuidv4 } from 'uuid'

export type MyteamSliceType = {
    myteam: MyTeamPokemonDetailedInfo[]
    addMyteam: (pokemon : PokemonDetailedInfo) => void
    deleteMyteam: (pokemonMyTeamId : string) => void
    handleEvolve: (pokemon : MyTeamPokemonDetailedInfo, pokemonEvo : PokemonDetailedInfo) => void
    loadFromStorage: () => void
}

export const createMyteamSlice : StateCreator<MyteamSliceType & PokedexSliceType & PokemonInfoSliceType & NotificationSliceType, [], [], MyteamSliceType> = (set, get, api) => ({
    myteam: [],
    addMyteam: (pokemon) => {
        const myTeamId = uuidv4();
        const newPokemon : MyTeamPokemonDetailedInfo = {
            pokemonDetailedInfo: pokemon,
            myteamId: myTeamId
        }
        set((state) => ({
            myteam: [...state.myteam, newPokemon]
        }))
        createNotificationSlice(set, get, api).showNotification({
            text: `${pokemon.name.toUpperCase()} added to My Team`,
            error: false
        })
        
        createPokemonInfoSlice(set, get, api).closeModal()
        localStorage.setItem('myteam', JSON.stringify(get().myteam))

    },
    deleteMyteam: (pokemonMyTeamId) => {
        const pokemonNameToDelete = get().myteam.find(team => team.myteamId === pokemonMyTeamId)?.pokemonDetailedInfo.name

        if(pokemonNameToDelete){
            set((state) => ({
                myteam: state.myteam.filter(team => team.myteamId !== pokemonMyTeamId)
            }))
            createNotificationSlice(set, get, api).showNotification({
                text: `${pokemonNameToDelete.toUpperCase()} removed from My Team`,
                error: false
            })
        }else{
            createNotificationSlice(set, get, api).showNotification({
                text: `Pokémon cannot removed`,
                error: true
            })
        }

        createPokemonInfoSlice(set, get, api).closeModal()
        localStorage.setItem('myteam', JSON.stringify(get().myteam))
    },
    handleEvolve: (pokemon, pokemonEvo) => {
        set((state) => ({
            myteam: [
                ...state.myteam.filter(team => team.myteamId !== pokemon.myteamId),
                { pokemonDetailedInfo: pokemonEvo, myteamId: pokemon.myteamId }
            ]
        }));
        createNotificationSlice(set, get, api).showNotification({
            text: `${pokemon.pokemonDetailedInfo.name.toUpperCase()} evolve to ${pokemonEvo.name.toUpperCase()}`,
            error: false
        })
        localStorage.setItem('myteam', JSON.stringify(get().myteam))
    },
    loadFromStorage: () => {
        const storedMyteam = localStorage.getItem('myteam')
        if(storedMyteam) {
            set({
                myteam: JSON.parse(storedMyteam)
            })
        }
    }
})