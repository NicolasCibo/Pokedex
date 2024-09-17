import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { useState, useEffect, useRef } from 'react'
import { useAppStore } from '../stores/useAppStore'
import { PokeURL } from "../types"
import PokemonEffectiveness from './PokemonEffectiveness'
import PokemonEvolution from './PokemonEvolution'
import PokemonMoves from './PokemonMoves'
import PokemonStats from './PokemonStats'
import Spinner from './Spinner'
import useMediaQuery from '@mui/material/useMediaQuery'

function PokemonModal() {

  const [shiny, setShiny] = useState(false)
  const [loading, setLoading] = useState(false)
  const ImgView = useRef<HTMLDivElement>(null)

  const modal = useAppStore(state => state.modal)
  const modalSource = useAppStore(state => state.modalSource)
  const myteamPokemonInfoId = useAppStore(state => state.myteamPokemonInfoId)
  const closeModal = useAppStore(state => state.closeModal)
  const pokemonFullInfo = useAppStore(state => state.pokemonFullInfo)
  const typeColor = useAppStore(state => state.typeColor)
  const addMyteam = useAppStore(state => state.addMyteam)
  const deleteMyteam = useAppStore(state => state.deleteMyteam)
  const appTitle = useAppStore(state => state.appTitle)

  const front_default = pokemonFullInfo.sprites?.other['official-artwork'].front_default
  const front_shiny = pokemonFullInfo.sprites?.other['official-artwork'].front_shiny
  const { types, evolution, abilities, moves, stats, height, weight } = pokemonFullInfo

  const effects = abilities?.map(ability => ability.effect_entries.filter(effect => effect.language.name === "en"))

  const is4k = useMediaQuery('(min-width: 3840px)')

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

  const handleMyTeamToggle = () => {
    if(modalSource === 'pokedex'){
      addMyteam(pokemonFullInfo)
    }else{
      deleteMyteam(myteamPokemonInfoId)
    }
  }

  function formatHeightWeight(value : number) : string {
    const formattedValue = (value / 10).toFixed(1)
    return formattedValue.replace('.', ',')
}

  const scrollToElement = () => {
    ImgView.current && ImgView.current.scrollIntoView({ behavior: 'smooth' })
  }

  const upgradeTitle = () => {
    document.title = appTitle
  }

  useEffect(() => {
    if(evolution && moves && abilities){
      setLoading(false)
    }else{
      setLoading(true)
    }
  }, [evolution, moves, abilities])

  return (
    <>
      <Transition appear show={modal}>
        <Dialog as="div" className="relative z-10 focus:outline-none" onClose={() => {closeModal(); shiny === true && showShiny(); upgradeTitle()}}>
          <div className={`${is4k ? 'flex justify-center' : ''} fixed inset-0 z-10 w-screen overflow-y-auto`}>
            <div className="flex min-h-full items-center justify-center p-4" ref={ImgView}>
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full rounded-xl bg-white/9 p-6 backdrop-blur-2xl">
                  <DialogTitle as="h3" className="text-4xl/7 font-semibold font-oswald uppercase text-center p-2">
                    {pokemonFullInfo.name}
                  </DialogTitle>
                  <h3 className='text-xl/7 font-semibold font-oswald uppercase text-center'>{pokemonIdTransition(pokemonFullInfo.id)}</h3>
                  <div className='flex flex-col md:flex-row justify-center'>
                    <div className='md:w-1/2'>
                      <div>
                        {front_default ? <img src={shiny ? front_shiny : front_default} alt={pokemonFullInfo.name} className="w-max mx-auto"/> : <Spinner />}
                      </div>

                      <div className="flex justify-center gap-1 md:gap-3">
                        {types ? types.map((type, index) => (
                          <p
                            key={index} 
                            className={`${typeColor(type.type.name)} p-2 rounded-full font-bold uppercase w-[83px] md:w-[91.48px] text-center`}
                          >
                          {type.type.name}
                          </p>
                        )) : (
                          <Spinner />
                        )}          
                      </div>

                      <div className='md:p-2 flex justify-center gap-5 mt-3'>
                          <p className='font-bold'>Height: {formatHeightWeight(height)} m</p>
                          <p className='font-bold'>Weight: {formatHeightWeight(weight)} kg</p>
                      </div>

                      <div className='md:p-2'>
                        <h3 className='text-center text-xl font-bold mt-5'>Stats</h3>
                        {stats ? <PokemonStats /> : <Spinner />}
                      </div>
                      
                      <div className='md:p-2'>
                        <h3 className='text-center text-xl font-bold mt-3'>Evolutionary Line</h3>
                        {evolution ? <PokemonEvolution /> : <Spinner />}
                      </div>    
                    </div>

                    <div className='md:w-1/2'>
                      <div className='md:p-2 mt-5 md:mt-0'>
                        <h3 className='text-center text-xl font-bold'>All Moves</h3>
                        {moves ? <PokemonMoves /> : <Spinner />}
                      </div>

                      <div>
                        <h3 className='text-center text-xl font-bold mt-5'>Abilities</h3>
                        {abilities ? (
                          abilities.map((ability, index) => (
                            <div key={index}>
                              <p className='border-b border-black font-oswald text-lg'>{ability.names[7] ? ability.names[7].name : ability.names[5].name} {ability.is_hidden[index] === true ? "(Hidden)" : ""}</p>
                              <p className='mb-3'><strong>Description</strong>: {effects[index][0] ? effects[index][0].effect : "No description available"}</p>
                            </div>
                          ))
                        ) : (
                          <Spinner />
                        )}
                      </div>

                      <div>
                        <h3 className='text-center text-xl font-bold mt-5'>Weaknesses and Resistances</h3>
                        <PokemonEffectiveness />
                      </div>
                    </div>
                  </div>
        
                  <div className="mt-4 flex justify-center gap-3">
                    <Button
                      id="close"
                      className="rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                      onClick={() => {closeModal(); shiny === true && showShiny()}}
                    >
                      Close
                    </Button>
                    <Button
                      id="shinyForm"
                      className="rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                      onClick={() => {showShiny() ; scrollToElement()}}
                    >
                      Show Shiny Form
                    </Button>
                    <Button
                      id="addPokemon"
                      className="rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white disabled:opacity-70"
                      onClick={handleMyTeamToggle}
                      disabled={loading}
                    >
                      {modalSource === 'myteam' ? `Delete to "My Team"` : `Add to "My Team"`}
                    </Button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default PokemonModal