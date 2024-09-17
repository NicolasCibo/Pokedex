import { useEffect, useState } from 'react'
import { useAppStore } from '../stores/useAppStore'
import type {PokemonDetailedInfo, MyTeamPokemonDetailedInfo } from '../types'

type MyteamPokemonCardProps = {
  pokemon : MyTeamPokemonDetailedInfo
}

function MyteamPokemonCard({pokemon} : MyteamPokemonCardProps) {

  const [isHover, setIsHover] = useState(false)
  const [shiny, setShiny] = useState(false)
  const [isEvolve, setIsEvolve] = useState(false)
  const [evolves, setEvolves] = useState<PokemonDetailedInfo['evolution']>([])
  const [evolving, setEvolving] = useState(false)

  const fetchPokemonDetailedInfo = useAppStore(state => state.fetchPokemonDetailedInfo)
  const typeColor = useAppStore(state => state.typeColor)
  const openModal = useAppStore(state => state.openModal)
  const capitalizeFirstLetter = useAppStore(state => state.capitalizeFirstLetter)
  const deleteMyteam = useAppStore(state => state.deleteMyteam)
  const handleEvolve = useAppStore(state => state.handleEvolve)
  const setMyteamPokemonInfoId = useAppStore(state => state.setMyteamPokemonInfoId)

  const { pokemonDetailedInfo, myteamId } = pokemon
  const { types, stats, evolution } = pokemonDetailedInfo

  const pokemonIdTransition = (id : PokemonDetailedInfo['id']) => {
    if(id < 10){
      return `#000${id}`
    }else if(id >= 10 && id < 100){
      return `#00${id}`
    }else if(id >= 100 && id < 1000){
      return `#0${id}`
    }else{
      return `#${id}`
    }
  }

  const showShiny = () => {
    if(shiny === true){
      setShiny(false)
    }else{
      setShiny(true)
    }
  }

  const convertToTitleCase = (input: string): string => {
    return input.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
  }

  const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0)

  const statNameCorrector = (statName : string) => {
    if(statName === "hp") return "HP"
    if(statName === "special-attack") return "Special Attack"
    if(statName === "special-defense") return "Special Defense"
    return capitalizeFirstLetter(statName)
  }

  const getBackgroundColor = (stat : number) => {
    if (stat >= 100) return 'text-green-500'
    if (stat >= 80) return 'text-yellow-500'
    if (stat >= 60) return 'text-orange-500'
    return 'text-red-400'
  }

  const evolvePokemon = async(evoId : number) => {
    setEvolving(true)
    const pokemonEvo = await fetchPokemonDetailedInfo(evoId)
    handleEvolve(pokemon, pokemonEvo)
    setEvolving(false)
  }

  const upgradeTitle = () => {
    document.title = `Pokédex - ${convertToTitleCase(pokemonDetailedInfo.name)}`
  }

  const modalMyTeam = () => {
    setMyteamPokemonInfoId(myteamId)
    fetchPokemonDetailedInfo(pokemonDetailedInfo.id)
    openModal('myteam')
    upgradeTitle()
  }

  useEffect(() => {
    const checkEvo = evolution.find(evo => evo.mainInfo.id === pokemonDetailedInfo.id)

    if(checkEvo !== undefined){
      setEvolves([checkEvo])
    }
  }, [evolution, pokemonDetailedInfo.id])

  return (
    <div className="bg-white p-2 md:p-3 rounded-md border shadow-lg relative w-[180px] h-[430px] md:w-[218px] md:h-[510px] transition-shadow duration-300 overflow-hidden"
      title={convertToTitleCase(pokemonDetailedInfo.name)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
        <p className="text-center text-xl font-bold">{pokemonIdTransition(pokemonDetailedInfo.id)}</p>
        <h3 className="font-oswald font-bold text-center text-2xl max-h-[32px] overflow-hidden text-ellipsis whitespace-nowrap">{convertToTitleCase(pokemonDetailedInfo.name)}</h3>
        <img src={shiny ? pokemonDetailedInfo.sprites.other["official-artwork"].front_shiny : pokemonDetailedInfo.sprites.other["official-artwork"].front_default} alt={convertToTitleCase(pokemonDetailedInfo.name)}
        className="w-32 md:w-48 mx-auto"/>
        
        <div className="flex justify-center gap-1 md:gap-3">
          {types.map((type, index) => (
            <p
              key={index} 
              className={`${typeColor(type.type.name)} p-1 rounded-full text-white font-bold uppercase w-[83px] md:w-[91.48px] text-center`}
            >
            {type.type.name}
            </p>  
          ))}          
        </div>

        <div className='mt-5'>
          {stats.map((stat, index)=> (
            <p key={index} className="flex justify-between border-b">
              {statNameCorrector(stat.stat.name)}
              <span className={`${getBackgroundColor(stat.base_stat)} font-bold`}>{stat.base_stat}</span>
            </p>
          ))}
          <p className="flex justify-between font-oswald font-bold">TOTAL<span className='text-blue-400 font-bold'>{totalStats}</span></p>
        </div>

        {isHover && (
          !isEvolve ? (
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center p-4 rounded-lg transition-opacity duration-700">
            <button onClick={modalMyTeam}
              className="bg-white text-black font-oswald font-bold py-1 px-3 m-2 rounded-xl hover:bg-gray-200">More info</button>
            <button onClick={showShiny}
              className="bg-white text-black font-oswald font-bold py-1 px-3 m-2 rounded-xl hover:bg-gray-200">Show shiny form</button>
            {evolves[0]?.evolvesTo.length ? (
              <button onClick={() => setIsEvolve(true)}
                className="bg-white text-black font-oswald font-bold py-1 px-3 m-2 rounded-xl hover:bg-gray-200">Evolve</button>
              ) : (
                null
              )
            }  
            <button onClick={() => deleteMyteam(myteamId)}
              className="bg-white text-black font-oswald font-bold py-1 px-3 m-2 rounded-xl hover:bg-gray-200"  
            >Delete to "My Team"</button>
          </div>
        ):(
          <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center p-4 rounded-lg transition-opacity duration-700">
            {evolves[0]?.evolvesTo?.map((evo, index) => (
              <button key={index} onClick={() => evolvePokemon(evo.mainInfo.id)} disabled={evolving ? true : false}
                className={`bg-white text-black font-oswald font-bold py-1 px-3 m-2 rounded-xl hover:bg-gray-200`}
              >{capitalizeFirstLetter(evo.mainInfo.name)}</button>
            ))}
            <button onClick={() => setIsEvolve(false)}
              className="bg-white text-black font-oswald font-bold py-1 px-3 m-2 rounded-xl hover:bg-gray-200 uppercase">Back</button>
          </div>
        ))}      
    </div>
  )
}

export default MyteamPokemonCard