import { useMemo, useEffect } from "react"
import PokemonCard from "../components/PokemonCard"
import Spinner from "../components/Spinner"
import { useAppStore } from "../stores/useAppStore"
import useMediaQuery from '@mui/material/useMediaQuery'

function IndexPage() {

  const pokemonListFiltered = useAppStore(state => state.pokemonListFiltered)
  const loadMorePokemonList = useAppStore(state => state.loadMorePokemonList)
  const loading = useAppStore(state => state.loading)
  const filterType = useAppStore(state => state.filterType)
  const filterName = useAppStore(state => state.filterName)
  const maxNumPokemon = useAppStore(state => state.maxNumPokemon)
  const hasPokemonList = useMemo(() => pokemonListFiltered.length, [pokemonListFiltered])

  const isMobile = useMediaQuery('(max-width: 768px)')

  const loadMore = () => {
    if(pokemonListFiltered.length !== 1020){
      loadMorePokemonList((isMobile ? 10 : 20), pokemonListFiltered.length)
    }else{
      loadMorePokemonList(4, pokemonListFiltered.length)
    }
  }

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
      return
    }
    loadMore()
  }

  useEffect(() => {
    if(filterType === "" && filterName === "" && pokemonListFiltered.length !== maxNumPokemon){
      window.addEventListener('scroll', handleScroll)
    }

    return () => window.removeEventListener('scroll', handleScroll)
  }, [loading, filterType, filterName])
  
  return (
    <>
      <main className="flex justify-center">
        {hasPokemonList ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1 md:gap-3 my-5">
          {pokemonListFiltered.map((pokemon => (
            <PokemonCard 
              key={pokemon.id}
              pokemon={pokemon}
            />
          )))}
          
          {(loading) ? <Spinner /> : null}
          </div>
        ) : (
          (filterName && !hasPokemonList ? (
            <p className="text-3xl text-white font-oswald font-bold mt-10">No Pokémon found</p>
          ) : (
            <Spinner />
          ))          
        )}        
      </main>
    </>
  )
}

export default IndexPage