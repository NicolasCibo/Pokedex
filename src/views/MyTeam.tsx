import { useMemo } from "react"
import { useAppStore } from "../stores/useAppStore"
import MyteamPokemonCard from "../components/MyteamPokemonCard"

function MyTeam() {

  const myteam = useAppStore(state => state.myteam)
  const hasMyteam = useMemo(() => myteam.length , [myteam])

  return (
    <>
      <main className="flex justify-center">
        {hasMyteam ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-1 md:gap-3 my-5">
          {myteam.map(((pokemon, index) => (
            <MyteamPokemonCard 
              key={index}
              pokemon={pokemon}
            />
          )))}
          </div>
        ) : (
          <p className="text-xl text-center text-white font-oswald font-bold mt-10">Your team is currently empty. Add some Pokémon to see them here!</p>
        )}   
      </main>
    </>
  )
}

export default MyTeam