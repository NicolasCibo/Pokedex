import { useAppStore } from "../stores/useAppStore"
import EffectivenessTR from "./EffectivenessTR"

type TypeEffectiveness = {    
    weak: string[]    
    resist: string[]    
    immune: string[]
}

export type TypeEffectivenessExtend = TypeEffectiveness & {
    superWeak: string[]
    normal: string[]
    superResist: string[]
}

function PokemonEffectiveness() {

    const typeEffectiveness : Record<string, TypeEffectiveness> = {
        normal: { weak: ['fighting'], immune: ['ghost'], resist: [] },
        fire: { weak: ['water', 'ground', 'rock'], immune: [], resist: ['fire', 'grass', 'ice', 'bug', 'steel', 'fairy'] },
        water: { weak: ['electric', 'grass'], immune: [], resist: ['fire', 'water', 'ice', 'steel'] },
        electric: { weak: ['ground'], immune: [], resist: ['electric', 'flying', 'steel'] },
        grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], immune: [], resist: ['water', 'electric', 'grass', 'ground'] },
        ice: { weak: ['fire', 'fighting', 'rock', 'steel'], immune: [], resist: ['ice'] },
        fighting: { weak: ['flying', 'psychic', 'fairy'], immune: [], resist: ['bug', 'rock', 'dark'] },
        poison: { weak: ['ground', 'psychic'], immune: [], resist: ['grass', 'fighting', 'poison', 'bug', 'fairy'] },
        ground: { weak: ['water', 'grass', 'ice'], immune: ['electric'], resist: ['poison', 'rock'] },
        flying: { weak: ['electric', 'ice', 'rock'], immune: ['ground'], resist: ['grass', 'fighting', 'bug'] },
        psychic: { weak: ['bug', 'ghost', 'dark'], immune: [], resist: ['fighting', 'psychic'] },
        bug: { weak: ['fire', 'flying', 'rock'], immune: [], resist: ['grass', 'fighting', 'ground'] },
        rock: { weak: ['water', 'grass', 'fighting', 'ground', 'steel'], immune: [], resist: ['normal', 'fire', 'poison', 'flying'] },
        ghost: { weak: ['ghost', 'dark'], immune: ['normal', 'fighting'], resist: ['poison', 'bug'] },
        dragon: { weak: ['ice', 'dragon', 'fairy'], immune: [], resist: ['fire', 'water', 'electric', 'grass'] },
        dark: { weak: ['fighting', 'bug', 'fairy'], immune: ['psychic'], resist: ['ghost', 'dark'] },
        steel: { weak: ['fire', 'fighting', 'ground'], immune: ['poison'], resist: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'] },
        fairy: { weak: ['poison', 'steel'], immune: ['dragon'], resist: ['fighting', 'bug', 'dark'] }
    }

    const pokemonFullInfo = useAppStore(state => state.pokemonFullInfo)
    const { types } = pokemonFullInfo

    const result : TypeEffectivenessExtend = {
        superWeak: [],
        weak: [],
        normal: [],
        resist: [],
        superResist: [],
        immune: []
    }


    if(types){
        types?.map(type => {
            if(typeEffectiveness[type.type.name as string]){
                const effectiveness = typeEffectiveness[type.type.name as string]
    
                effectiveness.weak.map(weak => {
                    if(!result.weak.includes(weak)){
                        result.weak = [...result.weak, weak]
                    }else{
                        result.superWeak = [...result.superWeak, weak]
                    }
                })
    
                effectiveness.resist.map(resist => {
                    if(!result.resist.includes(resist)){
                        result.resist = [...result.resist, resist]
                    }else{
                        result.superResist = [...result.superResist, resist]
                    }
                })
    
                effectiveness.immune.map(immune => {
                    if(!result.immune.includes(immune)){
                        result.immune = [...result.immune, immune]
                    }
                })
            }
        })

        if(result.superWeak){
            result.weak = result.weak.filter(weak => !result.superWeak.includes(weak))
        }
        if(result.superResist){
            result.resist = result.resist.filter(resist => !result.superResist.includes(resist))
        }

        const allTypes = ["normal", "fire", "water", "electric", "grass", "ice", "fighting", "poison", 
        "ground", "flying", "psychic", "bug", "rock", "ghost", "dragon", "dark", "steel", "fairy"];

        result.normal = [
            ...result.superWeak,
            ...result.weak,
            ...result.resist,
            ...result.superResist,
            ...result.immune
        ]
            
        result.normal = allTypes.filter(all => !result.normal.includes(all))
    }

  return (
    <div className="flex justify-center">
        <table className="min-w-full border-collapse">
            <tbody>
                {result && (
                    <>
                        <EffectivenessTR 
                            effectiveText="X4"
                            effectiveType={result.superWeak}
                        />
                        <EffectivenessTR 
                            effectiveText="X2"
                            effectiveType={result.weak}
                        />
                        <EffectivenessTR 
                            effectiveText="X1"
                            effectiveType={result.normal}
                        />
                        <EffectivenessTR 
                            effectiveText="X1/2"
                            effectiveType={result.resist}
                        />
                        <EffectivenessTR 
                            effectiveText="X1/4"
                            effectiveType={result.superResist}
                        />
                        <EffectivenessTR 
                            effectiveText="0"
                            effectiveType={result.immune}
                        />
                    </>
                )}
            </tbody>
        </table>
    </div>
  )
}

export default PokemonEffectiveness