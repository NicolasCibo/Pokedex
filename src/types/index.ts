import { z } from 'zod'
import { PokemonMainInfoSchema, FilterSchema, PokemonBasicInfo } from '../schemas/pokedex-schema'
import { AbilitiesInfoSchema, EvolutionChainSchema, MovesInfoSchema, PokemonDetailedInfoSchema, MyTeamPokemonDetailedInfoSchema} from '../schemas/pokemon-info-schema'

export type PokeURL = z.infer<typeof PokemonMainInfoSchema>
export type Filter = z.infer<typeof FilterSchema>
export type PokemonBasicInfo = z.infer<typeof PokemonBasicInfo>
export type PokemonDetailedInfo = z.infer<typeof PokemonDetailedInfoSchema>
export type MovesInfo = z.infer<typeof MovesInfoSchema>
export type AbilitiesInfo = z.infer<typeof AbilitiesInfoSchema>
export type EvolutionChainInfo = z.infer<typeof EvolutionChainSchema>
export type MyTeamPokemonDetailedInfo = z.infer<typeof MyTeamPokemonDetailedInfoSchema>