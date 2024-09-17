import { create } from "zustand";
import { createPokedexSlice, PokedexSliceType } from "./pokedexSlice";
import { createPokemonInfoSlice, PokemonInfoSliceType } from "./pokemonInfoSlice";
import { createMyteamSlice, MyteamSliceType } from "./myteamSlice"
import { createNotificationSlice, NotificationSliceType } from "./notificationSlice";


export const useAppStore = create<PokedexSliceType & PokemonInfoSliceType & MyteamSliceType & NotificationSliceType>((...a) => ({
    ...createPokedexSlice(...a),
    ...createPokemonInfoSlice(...a),
    ...createMyteamSlice(...a),
    ...createNotificationSlice(...a)    
}))