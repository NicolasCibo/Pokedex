import { useState, ChangeEvent, useEffect, useMemo } from "react"
import { useLocation } from "react-router-dom"
import Nav from "./Nav"
import { useAppStore } from "../stores/useAppStore"
import useMediaQuery from '@mui/material/useMediaQuery'

function Header() {

  const { pathname } = useLocation()
  const isHome = useMemo(() => pathname === '/' , [pathname])
  const isMobile = useMediaQuery('(max-width: 768px)')

  const pokemonListFiltered = useAppStore(state => state.pokemonListFiltered)
  const fetchPokemonList = useAppStore(state => state.fetchPokemonList)
  const fetchFilterPokemonListByType = useAppStore(state => state.fetchFilterPokemonListByType)
  const filterPokemonListByName = useAppStore(state => state.filterPokemonListByName)
  const upgradeAppTitle = useAppStore(state => state.upgradeAppTitle)
  const filterType = useAppStore(state => state.filterType)

  const [menuOpen, setMenuOpen] = useState(false)

  const handleChange = (e : ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {
    if(e.target.value !== ""){
      upgradeAppTitle(`Pokédex - searching by type: "${e.target.value}"`)
      document.title = `Pokédex - searching by type: "${e.target.value}"`
    }else{
      document.title = `Pokédex - Home`
    }
    fetchFilterPokemonListByType(e.target.value)
  }

  const handleSearch = () => {
    const inputPokeNameElement = document.getElementById('pokeName') as HTMLInputElement | null
    if(inputPokeNameElement){
      const inputValue = inputPokeNameElement.value
      if(inputValue.length === 0){
        upgradeAppTitle(`Pokédex - Home`)
        document.title = `Pokédex - Home`
      }else if(inputValue.length > 2){
        upgradeAppTitle(`Pokédex - Searching by name: "${inputValue}"`)
        document.title = `Pokédex - Searching by name: "${inputValue}"`
      }
      filterPokemonListByName(inputValue)
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  } 

  useEffect(() => {
    fetchPokemonList((isMobile ? 10 : 20), 0)
  }, [])

  useEffect(() => {
    const pageTitle = pathname === "/myteam" ? "Pokédex - My Team" : "Pokédex - Home"
    upgradeAppTitle(pageTitle)
    document.title = pageTitle 
  }, [pathname])
  
  
  return (
    <>
      <div className="flex justify-around md:justify-evenly">
        <img
          src="../pokemon_logo.webp" 
          alt="Pokémon Logo"
          className="p-1 w-48 md:w-72" 
          loading="lazy" 
        />

        <div className="md:hidden my-auto flex">
          <button onClick={toggleMenu} className="text-white focus:outline-none" aria-label={menuOpen ? "Close menu" : "Open menu"}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-14">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        <Nav 
          menuOpen={false}
          toggleMenu={toggleMenu}
        />
      </div>

      <div className={`fixed inset-0 z-50 bg-black bg-opacity-60 transition-transform transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute right-0 top-0 bg-white/9 w-48 h-full p-4 backdrop-blur-2xl">
          <button onClick={toggleMenu} className="text-white focus:outline-none absolute top-4 right-4" aria-label={menuOpen ? "Close menu" : "Open menu"}>
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <Nav 
            menuOpen={menuOpen}
            toggleMenu={toggleMenu}
          />
        </div>
      </div>   

      {isHome && (
        <>
          <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-10 mt-2">
            <div className="flex justify-center">
              <label htmlFor="type" 
                className="my-auto text-xl font-bold text-white mr-1">Filter Type:</label>
              <select name="type" id="type" className="border p-2 rounded-full" onChange={handleChange}>
                <option value="">All</option>
                <option value="normal">Normal</option>
                <option value="fire">Fire</option>
                <option value="water">Water</option>
                <option value="electric">Electric</option>
                <option value="grass">Grass</option>
                <option value="ice">Ice</option>
                <option value="fighting">Fighting</option>
                <option value="poison">Poison</option>
                <option value="ground">Ground</option>
                <option value="flying">Flying</option>
                <option value="psychic">Psychic</option>
                <option value="bug">Bug</option>
                <option value="rock">Rock</option>
                <option value="ghost">Ghost</option>
                <option value="dragon">Dragon</option>
                <option value="dark">Dark</option>
                <option value="steel">Steel</option>
                <option value="fairy">Fairy</option>
              </select>
            </div>

            <div className="flex justify-center md:gap-1">
              <label htmlFor="pokeName" className="my-auto text-xl font-bold text-white mr-1">Filter Name:</label>
              <input type="text" placeholder="Pokémon Name..." id="pokeName"
                onKeyDown={(e) => {if (e.key === 'Enter'){handleSearch()}}} 
                disabled={filterType !== "" ? true : false}
                className="border p-2 rounded-full disabled:bg-gray-200"/>
              <button onClick={handleSearch} hidden={isMobile ? true : false} disabled={filterType !== "" ? true : false}
                className="bg-white text-black text-base font-oswald font-bold py-2 px-4 uppercase rounded-full hover:bg-gray-100 disabled:bg-gray-200"
              >Search</button>
            </div>
            <button onClick={handleSearch} hidden={!isMobile ? true : false} disabled={filterType !== "" ? true : false}
              className="bg-white text-black text-base font-oswald font-bold py-2 mx-1 uppercase rounded-full hover:bg-gray-100 disabled:bg-gray-200"
            >Search</button>
          </div>
          
          <div className="flex flex-col md:flex-row justify-center mt-3 gap-2 md:gap-5">
            <p className="my-auto mx-auto md:mx-0 text-white text-xl font-bold">Pokémon Loaded: {pokemonListFiltered.length}</p>
          </div>
        </>
      )}
    </>
  )
}

export default Header