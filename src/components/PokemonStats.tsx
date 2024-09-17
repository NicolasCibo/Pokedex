import { useAppStore } from '../stores/useAppStore'
import useMediaQuery from '@mui/material/useMediaQuery'

function PokemonStats() {

    const capitalizeFirstLetter = useAppStore(state => state.capitalizeFirstLetter)
    const pokemonFullInfo = useAppStore(state => state.pokemonFullInfo)
    const { stats } = pokemonFullInfo

    const totalStats = stats.reduce((sum, stat) => sum + stat.base_stat, 0)
    const isMobile = useMediaQuery('(max-width: 768px)')

    const statNameCorrector = (statName : string) => {
        if(statName === "hp") return "HP"
        if(statName === "special-attack") return "Special Attack"
        if(statName === "special-defense") return "Special Defense"
        return capitalizeFirstLetter(statName)
    }

    const getBackgroundColor = (stat : number) => {
        if (stat >= 100) return 'bg-green-400'
        if (stat >= 80) return 'bg-yellow-400'
        if (stat >= 60) return 'bg-orange-400'
        return 'bg-red-400'
    }

  return (
    <>
        <table className='table-fixed border-collapse border border-gray-800 mx-auto'>
            <tbody>
                {stats.map((stat, index) => (
                    <tr key={index}>
                        <td className='font-bold border border-black p-2'>{statNameCorrector(stat.stat.name)}</td>
                        <td className="border border-black p-2">
                            <div 
                                className="relative w-full bg-gray-200 rounded-full h-6"
                                style={isMobile ? { width: 255 / 1.25 } : { width: 255 }}
                            >
                                <div 
                                    className={`absolute top-0 left-0 h-full rounded-full flex items-center justify-center ${getBackgroundColor(stat.base_stat)}`}
                                    style={isMobile ? { width: stat.base_stat / 1.25 } : { width: stat.base_stat }}
                                >
                                    <span className="text-xs font-bold">{stat.base_stat}</span>
                                </div>
                            </div>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td className='border border-black p-2 font-oswald font-bold uppercase'>Total</td>
                    <td className="border border-black p-2">
                        <div 
                            className="relative w-full bg-gray-200 rounded-full h-6"
                            style={isMobile ? { width: (780 / 3.05) / 1.25 } : { width: (780 / 3.05) }}
                        >
                            <div 
                                className={`absolute top-0 left-0 h-full rounded-full flex items-center justify-center bg-blue-400`}
                                style={isMobile ? { width: (totalStats / 3.05) / 1.25 } : { width: (totalStats / 3.05) }}
                            >
                                <span className="text-xs font-bold">{totalStats}</span>
                            </div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>       
    </>
  )
}

export default PokemonStats