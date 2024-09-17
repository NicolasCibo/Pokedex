import { z } from 'zod'

export const PokemonBasicInfo = z.object({
    name: z.string(),
    url: z.string()
})

export const PokemonMainInfoSchema = z.object({
    id: z.number(),
    name: z.string(),
    types: z.array(
        z.object({
            type: z.object({
                name: z.string()
            })
        })
    ),
    sprites: z.object({
        front_default: z.string(),
        front_shiny: z.string(),
        other: z.object({
            'official-artwork': z.object({
                front_default: z.string(),
                front_shiny: z.string()
            }),

        })
    })
})

export const PokemonURLAPIResponseSchema = z.object({
    results: z.array(
        z.object({
            name: z.string(),
            url: z.string()
        })    
    )
})

export const FilterSchema = z.object({
    type: z.string(),
    pokeName: z.string() 
})

export const FilterTypeAPIResponseSchema = z.object({
    pokemon: z.array(
        z.object({
            pokemon: z.object({
                url: z.string()
            })
        })
    )
})