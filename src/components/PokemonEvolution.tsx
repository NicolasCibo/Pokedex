import { useAppStore } from '../stores/useAppStore'
import { EvolutionChainInfo } from '../types'
import useMediaQuery from '@mui/material/useMediaQuery'

function PokemonEvolution() {

    const capitalizeFirstLetter = useAppStore(state => state.capitalizeFirstLetter)
    const fetchPokemonDetailedInfo = useAppStore(state => state.fetchPokemonDetailedInfo)
    const pokemonFullInfo = useAppStore(state => state.pokemonFullInfo)
    const { evolution } = pokemonFullInfo

    const isMobile = useMediaQuery('(max-width: 768px)')

    const clickPokemonInfo = (currentPokemonId : number) => {
        if(currentPokemonId !== pokemonFullInfo?.id){
          fetchPokemonDetailedInfo(currentPokemonId)
        }
    }

    const convertToTitleCase = (input: string): string => {
        return input.split('-')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
    }

    const triggerNameCorrection = (trigger : string) => {
        if(trigger === "level-up" || trigger === "use-item"){
            return ":"
        }else{
            return "+"
        }
    }

    const evolutionMethod = (detail : EvolutionChainInfo['chain']['evolution_details'][0]) => {
        let method : string[] = []

            method = [...method, `${convertToTitleCase(detail.trigger.name)} ${triggerNameCorrection(detail.trigger.name)} `]
            if(detail.gender !== null){
                if(detail.gender === 1){
                    method = [...method, "Female "]
                }else{
                    method = [...method, "Male "]
                }
            }
            if(detail.held_item !== null){
                method = [...method, `Held item: "${convertToTitleCase(detail.held_item.name)}"`]
            }
            if(detail.item !== null){
                method = [...method, `"${convertToTitleCase(detail.item.name)}"`]
            }
            if(detail.known_move !== null){
                method = [...method, `Known move "${convertToTitleCase(detail.known_move.name)}"`]
            }
            if(detail.known_move_type !== null){
                method = [...method, `Known "${convertToTitleCase(detail.known_move_type.name)}" move type`]
            }
            if(detail.location !== null){
                method = [...method, `in "${convertToTitleCase(detail.location.name)}"`]
            }
            if(detail.min_affection !== null){
                method = [...method, ` + affection`]
            }
            if(detail.min_beauty !== null){
                method = [...method, detail.min_beauty.toString()]
            }
            if(detail.min_happiness !== null){
                method = [...method, `${detail.min_happiness} of happiness `]
            }
            if(detail.min_level !== null){
                method = [...method, detail.min_level.toString()]
            }
            if(detail.needs_overworld_rain !== false){
                method = [...method, "requiere que llueva"]
            }
            if(detail.party_species !== null){
                method = [...method, convertToTitleCase(detail.party_species.name)]
            }
            if(detail.party_type !== null){
                method = [...method, convertToTitleCase(detail.party_type.name)]
            }
            if(detail.relative_physical_stats !== null){
                method = [...method, detail.relative_physical_stats.toString()]
            }
            if(detail.time_of_day !== ""){
                method = [...method, ` ${convertToTitleCase(detail.time_of_day)}`]
            }
            if(detail.trade_species !== null){
                method = [...method, convertToTitleCase(detail.trade_species.name)]
            }

        return method
    }

  return (
    <div className='flex items-center justify-center gap-4 mt-2'>
        {evolution.map((evo, index) => (
            <div key={index} className='flex items-center gap-2'>
                <div onClick={() => clickPokemonInfo(evo.mainInfo.id)} className='flex flex-col items-center'>
                    <img src={evo.mainInfo.sprites.front_default} alt={evo.mainInfo.name}
                        className={`w-16 h-16 ${pokemonFullInfo?.id !== evo.mainInfo.id && "hover:cursor-pointer"}`} />
                    <p 
                        className={`text-center font-bold border-b border-blue-600 border-opacity-0 ${pokemonFullInfo?.id !== evo.mainInfo.id && "text-blue-600 hover:cursor-pointer hover:border-opacity-100"}`}
                    >{capitalizeFirstLetter(evo.mainInfo.name)}</p>
                </div>
                {(index !== evolution.length - 1) && (
                    <div className='flex justify-center relative'>
                        <img src="../assets/arrow.png" alt="arrow" className='w-32 h-10 opacity-50' />
                        <p className={`absolute text-center ${isMobile ? 'text-sm font-light' : 'font-semibold'} font-oswald  mt-1`}>{evolutionMethod(evo.evolvesTo[0].evolution_details[0])}</p>
                    </div>
                )}
                {evo.evolvesTo && evo.evolvesTo.length > 1 && (
                    <div className='flex flex-col items-center gap-2'>
                        {evo.evolvesTo.map((evoTo, evoIndex) => (
                            <div key={evoIndex} className='flex items-center gap-2'>
                                <div className='flex justify-center relative'>
                                    <img src="../assets/arrow.png" alt="arrow" className='w-32 h-10 opacity-50' />
                                    <p className={`absolute text-center ${isMobile ? 'text-sm font-light' : 'font-semibold'} font-oswald  mt-1`}>{evolutionMethod(evoTo.evolution_details[0])}</p>
                                </div>
                                <div onClick={() => clickPokemonInfo(evoTo.mainInfo.id)} className='flex flex-col items-center'>
                                    <img src={evoTo.mainInfo.sprites.front_default} alt={evoTo.mainInfo.name} 
                                        className={`w-16 h-16 ${pokemonFullInfo?.id !== evoTo.mainInfo.id && "hover:cursor-pointer"}`} />
                                    <p 
                                        className={`text-center border-b border-blue-600 border-opacity-0 ${pokemonFullInfo?.id !== evoTo.mainInfo.id && "text-blue-600 hover:cursor-pointer hover:border-opacity-100"}`}
                                    >{capitalizeFirstLetter(evoTo.mainInfo.name)}</p>
                                    
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        ))}
    </div>
  )
}

export default PokemonEvolution