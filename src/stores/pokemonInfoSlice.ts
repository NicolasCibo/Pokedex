import { StateCreator } from "zustand"
import { getAbilitiesInfo, getEvoInfo, getEvosAndFormsURL, getAnotherEvosAndFormsURL, getMovesInfo, getPokemonDetailedInfo, getPokemonMovesAndAbilitiesURL } from "../services/PokemonInfoService"
import { getPokemonList } from "../services/PokedexService"
import { AbilitiesInfo, MovesInfo, PokemonDetailedInfo } from "../types"

export type PokemonInfoSliceType = {
    pokemonFullInfo: PokemonDetailedInfo
    modal: boolean
    modalSource: string
    myteamPokemonInfoId: string
    fetchPokemonDetailedInfo: (id : PokemonDetailedInfo['id']) => Promise<PokemonDetailedInfo>
    openModal: (source : string) => void
    closeModal: () => void
    freePokemonFullInfo: () => void
    typeColor: (nameColor : string) => string
    capitalizeFirstLetter: (word : string) => string
    setMyteamPokemonInfoId: (id : string) => void
}

export const createPokemonInfoSlice : StateCreator<PokemonInfoSliceType> = (set, get) => ({
    pokemonFullInfo: {} as PokemonDetailedInfo,
    modal: false,
    modalSource: '',
    myteamPokemonInfoId: '',
    fetchPokemonDetailedInfo: async(id) => {  
        get().freePokemonFullInfo()
        const responsePokemonInfo = await getPokemonDetailedInfo(id)
        if(responsePokemonInfo){
            set(state => ({
              pokemonFullInfo: {
                  ...state.pokemonFullInfo,
                  id: responsePokemonInfo.id,
                  name: responsePokemonInfo.name,
                  types: responsePokemonInfo.types,
                  sprites: responsePokemonInfo.sprites,
                  stats: responsePokemonInfo.stats,
                  height: responsePokemonInfo.height,
                  weight: responsePokemonInfo.weight
              }
          }))
        }
        const response = await getPokemonMovesAndAbilitiesURL(id)

        const is_hidden: boolean[] = response!.abilities.filter(ability => ability.is_hidden !== undefined).map(ability => ability.is_hidden);

        const promisesMoves = response?.moves.map(move => getMovesInfo(move.move.url)).filter((move => move !== null && move !== undefined))
        const promisesAbilities = response?.abilities.map(ability => getAbilitiesInfo(ability.ability.url))

        const responseMove = await Promise.allSettled(promisesMoves!)
        const responseAbility = await Promise.allSettled(promisesAbilities!)

        const responseMoveList : PokemonDetailedInfo['moves'] = responseMove
          .filter((result): result is PromiseFulfilledResult<MovesInfo> => result.status === 'fulfilled')
          .map(result => result.value)

        const responseAbilityList : PokemonDetailedInfo['abilities'] = responseAbility
          .filter((result): result is PromiseFulfilledResult<AbilitiesInfo> => result.status === 'fulfilled')
          .map((result) => ({
            ...result.value,
            is_hidden: is_hidden
        }))
        
        const responseEvosAndForms = await getEvosAndFormsURL(id)
        const evolutionList = await getEvoInfo(responseEvosAndForms!.evolution_chain.url)

        let evolutionInfo : PokemonDetailedInfo['evolution'] = []
        let currentChain = evolutionList?.chain

        while(currentChain !== undefined){
            const response = await getAnotherEvosAndFormsURL(currentChain.species.url)
            const mainInfo = await getPokemonList(response!.varieties[0].pokemon.url)

            const evolvesTo = await Promise.all(currentChain.evolves_to.map(async evo => {
                const response = await getAnotherEvosAndFormsURL(evo.species.url)
                if(!response){
                    throw new Error(`Failed to fetch data for URL: ${evo.species.url}`)
                }else{
                    const mainInfo = await getPokemonList(response!.varieties[0].pokemon.url)
                    if(!mainInfo){
                        throw new Error(`Failed to fetch main info for URL: ${response.varieties[0].pokemon.url}`)
                    }else{
                        return {
                            mainInfo,
                            evolution_details: evo.evolution_details
                        }
                    } 
                }
                
            }))

            if (mainInfo !== undefined) {
                const combinedInfo : typeof evolutionInfo[0] = {
                    mainInfo: mainInfo,
                    evolvesTo: evolvesTo.map(evo => ({
                        mainInfo: evo.mainInfo,
                        evolution_details: evo.evolution_details
                    }))
                }
                evolutionInfo = [...evolutionInfo, combinedInfo]
            }
                    
            if(currentChain.evolves_to.length > 1){
                currentChain = undefined
            } else{
                currentChain = currentChain.evolves_to[0]
            }
        }

        set(state => ({
            pokemonFullInfo: {
                ...state.pokemonFullInfo,
                moves: responseMoveList,
                abilities: responseAbilityList,
                evolution: evolutionInfo
            }
        }))

        return get().pokemonFullInfo
    },
    openModal: (source) => {
      set({ 
        modal: true,
        modalSource: source
      })
    },
    closeModal: () => {
        set({
            modal: false,
            modalSource: '',
            pokemonFullInfo: {} as PokemonDetailedInfo
        })
    },
    freePokemonFullInfo: () => {
      set({pokemonFullInfo: {} as PokemonDetailedInfo})
    },
    typeColor: (nameColor) => {
      switch (nameColor) {
        case 'normal':
          return 'bg-normal';
        case 'fire':
          return 'bg-fire';
        case 'water':
          return 'bg-water';
        case 'electric':
          return 'bg-electric';
        case 'grass':
          return 'bg-grass';
        case 'ice':
          return 'bg-ice';
        case 'fighting':
          return 'bg-fighting text-white';
        case 'poison':
          return 'bg-poison text-white';
        case 'ground':
          return 'bg-ground';
        case 'flying':
          return 'bg-flying';
        case 'psychic':
          return 'bg-psychic';
        case 'bug':
          return 'bg-bug';
        case 'rock':
          return 'bg-rock';
        case 'ghost':
          return 'bg-ghost text-white';
        case 'dragon':
          return 'bg-dragon text-white';
        case 'dark':
          return 'bg-dark text-white';
        case 'steel':
          return 'bg-steel';
        case 'fairy':
          return 'bg-fairy';
        default:
          return 'bg-gray-400';
      }
    },
    capitalizeFirstLetter: (word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    },
    setMyteamPokemonInfoId: (id) => {
      set({myteamPokemonInfoId: id})
    }
})