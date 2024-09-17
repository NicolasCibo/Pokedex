import { z } from 'zod'
import { PokemonMainInfoSchema } from './pokedex-schema'

export const EvosAndFormsURL = z.object({
    evolution_chain: z.object({
        url: z.string()
    }),
    varieties: z.array(
        z.object({
            pokemon: z.object({
                url: z.string()
            })
        })  
    )
})

const EvolutionDetailsSchema = z.object({
    gender: z.number().nullable(),
    held_item: z.object({
        name: z.string()
    }).nullable(),
    item: z.object({
        name: z.string()
    }).nullable(),
    known_move: z.object({
        name: z.string()
    }).nullable(),
    known_move_type: z.object({
        name: z.string()
    }).nullable(),
    location: z.object({
        name: z.string()
    }).nullable(),
    min_affection: z.number().nullable(),
    min_beauty: z.number().nullable(),
    min_happiness: z.number().nullable(),
    min_level: z.number().nullable(),
    needs_overworld_rain: z.boolean(),
    party_species: z.object({
        name: z.string()
    }).nullable(),
    party_type: z.object({
        name: z.string()
    }).nullable(),
    relative_physical_stats: z.number().nullable(),
    time_of_day: z.string(),
    trade_species: z.object({
        name: z.string()
    }).nullable(),
    trigger: z.object({
        name: z.string()
    })    
})

type EvolutionType = {
    species:{
        name: string
        url: string
    }
    evolves_to: EvolutionType[]
    evolution_details: z.infer<typeof EvolutionDetailsSchema>[]
}

const EvolutionSchema : z.ZodType<EvolutionType> = z.object({
    species: z.object({
        name: z.string(), 
        url: z.string()
    }), 
    evolves_to: z.lazy(() => EvolutionSchema.array()),
    evolution_details: z.array(EvolutionDetailsSchema)
})

export const EvolutionChainSchema = z.object({
    chain: EvolutionSchema
})

export const MovesInfoSchema = z.object({
    names: z.array(
        z.object({
            language: z.object({
                name: z.string()
            }),
            name: z.string()
        })
    ),
    damage_class: z.object({
        name: z.string()
    }),
    effect_entries: z.array(
        z.object({
            effect: z.string()
        })
    ),
    power: z.number().nullable(),
    accuracy: z.number().nullable(),
    pp: z.number(),
    type: z.object({
        name: z.string()
    })
})

export const AbilitiesInfoSchema = z.object({
    effect_entries: z.array(
        z.object({
            language: z.object({
                name: z.string()
            }),
            effect: z.string()
        })
    ),
    names: z.array(
        z.object({
            name: z.string()
        })
    )
})

export const PokemonMovesAndAbilitiesURL = z.object({
    moves: z.array(
        z.object({
            move: z.object({
                url: z.string()
            })
        })
    ), 
    abilities: z.array(
        z.object({
            ability: z.object({
                url: z.string()
            }),
            is_hidden: z.boolean()
        })
    )
})

export const PokemonInfoSchema = z.object({
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
    }),
    stats: z.array(
        z.object({
            base_stat: z.number(),
            stat: z.object({
                name: z.string()
            })
        })
    ),
    height: z.number(),
    weight: z.number()
})

export const PokemonDetailedInfoSchema = z.object({
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
    }),
    stats: z.array(
        z.object({
            base_stat: z.number(),
            stat: z.object({
                name: z.string()
            })
        })
    ),
    moves: z.array(MovesInfoSchema),
    abilities: z.array(
        z.object({
            effect_entries: z.array(
                z.object({
                    language: z.object({
                        name: z.string()
                    }),
                    effect: z.string()
                })
            ),
            names: z.array(
                z.object({
                    name: z.string()
                })
            ),
            is_hidden: z.array(z.boolean())
        }) 
    ),
    height: z.number(),
    weight: z.number(),
    evolution: z.array(
        z.object({
            mainInfo: PokemonMainInfoSchema,
            evolvesTo: z.array(
                z.object({
                    mainInfo: PokemonMainInfoSchema,
                    evolution_details: z.array(EvolutionDetailsSchema)
                })
            )            
        })   
    )
})

export const MyTeamPokemonDetailedInfoSchema = z.object({
    myteamId: z.string(),
    pokemonDetailedInfo: PokemonDetailedInfoSchema
})