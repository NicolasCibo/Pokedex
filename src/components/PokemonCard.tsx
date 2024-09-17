import { useState, useEffect } from 'react'
import { useAppStore } from '../stores/useAppStore'
import type { PokeURL } from '../types'
import Spinner from './Spinner'
import useMediaQuery from '@mui/material/useMediaQuery'
import Loading from './Loading'

type PokemonCardProps = {
  pokemon : PokeURL
}

function PokemonCard({pokemon} : PokemonCardProps) {

  const [isHover, setIsHover] = useState(false)
  const [shiny, setShiny] = useState(false)
  const [loading, setLoading] = useState(false)

  const isMobile = useMediaQuery('(max-width: 768px)')

  const fetchPokemonDetailedInfo = useAppStore(state => state.fetchPokemonDetailedInfo)
  const openModal = useAppStore(state => state.openModal)
  const typeColor = useAppStore(state => state.typeColor)
  const addMyteam = useAppStore(state => state.addMyteam)

  const pokemonIdTransition = (id : PokeURL['id']) => {
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

  const convertToTitleCase = (input : string): string => {
    return input.split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
  }  

  const addMyTeam = async() => {
    setLoading(true)
    const pokemonAdd = await fetchPokemonDetailedInfo(pokemon.id)
    addMyteam(pokemonAdd)
    setLoading(false)
  }

  const upgradeTitle = () => {
    document.title = `Pokédex - ${convertToTitleCase(pokemon.name)}`
  }

  useEffect(() => {
    if (loading) {
      // Inhabilitar el scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Habilitar el scroll
      document.body.style.overflow = 'auto';
    }

    // Limpiar el efecto cuando el componente se desmonte
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [loading]);
  

  return (
    <div className="bg-white p-2 md:p-3 rounded-md border shadow-lg relative w-[180px] h-[230px] md:w-[218px] md:h-[315px] transition-shadow duration-300 overflow-hidden" 
      title={convertToTitleCase(pokemon.name)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <p className="text-center text-xl font-bold">{pokemonIdTransition(pokemon.id)}</p>
      <h3 className="font-oswald font-bold text-center text-2xl max-h-[32px] overflow-hidden text-ellipsis whitespace-nowrap">{convertToTitleCase(pokemon.name)}</h3>
      {pokemon.sprites ? (
        <img 
          src={(shiny ? `${pokemon.sprites.other["official-artwork"].front_shiny}?format=webp` : `${pokemon.sprites.other["official-artwork"].front_default}?format=webp`)}
          alt={convertToTitleCase(pokemon.name)} 
          className="w-28 md:w-48 mx-auto" 
          loading="lazy" 
        />
      ) : (
        <Spinner />
      )}

      
      <div className="flex justify-center gap-1 md:gap-3">
        {pokemon.types.map((type, index) => (
          <p
            key={index} 
            className={`${typeColor(type.type.name)} p-2 rounded-full  font-bold uppercase w-[83px] md:w-[91.48px] text-center`}
          >
          {type.type.name === "fighting" && isMobile ? "fghtng" : type.type.name}
          </p>  
        ))}          
      </div>

      {isHover && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center p-4 rounded-lg transition-opacity duration-700">
          <button onClick={() => {fetchPokemonDetailedInfo(pokemon.id); openModal('pokedex'); upgradeTitle()}}
            className="bg-white text-black font-oswald font-bold py-1 px-3 m-2 rounded-xl hover:bg-gray-200">More info</button>
          <button onClick={showShiny}
            className="bg-white text-black font-oswald font-bold py-1 px-3 m-2 rounded-xl hover:bg-gray-200">Show shiny form</button>
          <button onClick={() => addMyTeam()} disabled={loading}
            className="bg-white text-black font-oswald font-bold py-1 px-3 m-2 rounded-xl hover:bg-gray-200 disabled:opacity-70"  
          >Add to "My Team"</button>
        </div>
      )}
      {loading ? <Loading /> : null}     
    </div>
  )
}

export default PokemonCard