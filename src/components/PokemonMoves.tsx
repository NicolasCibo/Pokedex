import { useState, useEffect, useRef , ChangeEvent } from 'react'
import { useAppStore } from '../stores/useAppStore'
import { MovesInfo } from '../types/index'
import useMediaQuery from '@mui/material/useMediaQuery'

function PokemonMoves() {

    const typeColor = useAppStore(state => state.typeColor)
    const pokemonFullInfo = useAppStore(state => state.pokemonFullInfo)
    const { moves } = pokemonFullInfo

    const [expandedRows, setExpandedRows] = useState<number[]>([])
    const [scrollLeftDetect, setScrollLeftDetect] = useState(false)
    const [movesFilterList, setMovesFilterList] = useState<MovesInfo[]>(moves)
    const tableContainerRef = useRef<HTMLDivElement>(null)

    const isScrollable = moves.length > 10
    const moveNames = movesFilterList?.map(move => move.names.filter(name => name.language.name === "en"))
    const isMobile = useMediaQuery('(max-width: 768px)')
    const isTablet = useMediaQuery('(max-width: 1024px)')

    const toggleRowExpansion = (index : number) => {
        setExpandedRows((prev) => prev.includes(index) 
            ? prev.filter((i) => i !== index)
            : [...prev, index]
        )
    }

    const handleSearch = (e : ChangeEvent<HTMLInputElement>) => {
        const searchMove = e.target.value.toLowerCase()
        const flatMoves = moves.flat()

        const filtered = flatMoves.filter(move =>
            move.names.some(name => name.name.toLowerCase().includes(searchMove))
        )
        setMovesFilterList(filtered)
    }

    useEffect(() => {
        const tableContainer = tableContainerRef.current

        const handleScroll = () => {
            if (tableContainer && tableContainer.scrollLeft > 0) {
            setScrollLeftDetect(true)
            } else {
            setScrollLeftDetect(false)
            }
        }

        if (tableContainer) {
            tableContainer.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (tableContainer) {
                tableContainer.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

  return (
    <>
        <div className="flex justify-center gap-1 mb-1 text-center">
            <input type="text" placeholder="Search by move name..." onChange={handleSearch}
                className="w-[90%] py-1 pl-2 border text-black rounded-lg outline-none focus:border-blue-500" />
            <p className='my-auto'>T: {movesFilterList.length}</p>
        </div>
        <div 
            id="table-container"
            ref={tableContainerRef}
            className={`${isScrollable ? 'md:h-96 md:overflow-y-scroll md:scrollbar-custom' : 'overflow-y-auto'} overflow-x-auto`}
        >
            <table className="min-w-full border-collapse table-fixed">
                <thead>
                    <tr>
                        <th className={`p-1 border border-black ${scrollLeftDetect ? 'bg-white/9 backdrop-blur' : ''} min-w-24 md:min-w-32 sticky left-0`}>Move</th>
                        <th className={`p-1 border border-black ${scrollLeftDetect ? 'bg-white' : ''} `}>Type</th>
                        <th className={`p-1 border border-black ${scrollLeftDetect ? 'bg-white' : ''} `}>Class</th>
                        <th className={`p-1 border border-black ${scrollLeftDetect ? 'bg-white' : ''} `}>{isMobile ? "Pwr" : "Power"}</th>
                        <th className={`p-1 border border-black ${scrollLeftDetect ? 'bg-white' : ''} `}>PP</th>
                        <th className={`p-1 border border-black ${scrollLeftDetect ? 'bg-white' : ''} `}>{isMobile ? "Acc" : "Accuracy"}</th>
                        <th className={`p-1 border border-black ${scrollLeftDetect ? 'bg-white' : ''} `}>Effect</th>
                    </tr>
                </thead>
                <tbody>
                    {movesFilterList ? movesFilterList.map((move, index) => (
                        <tr key={index} title={moveNames[index][0].name}>
                            <td className={`p-1 border border-black font-oswald font-bold md:font-arial ${scrollLeftDetect ? 'bg-white/9 backdrop-blur' : ''} w-16 sticky left-0`}>{moveNames[index][0].name}</td>
                            <td className={`${typeColor(move.type.name)} p-1 uppercase text-center text-white text-sm md:text-base font-bold border border-black w-10`}>{move.type.name}</td>
                            <td className='p-1 border border-black w-10'><img src={`../assets/${move.damage_class.name}.gif`} alt={move.damage_class.name} className="mx-auto"/></td>
                            <td className='p-1 text-center border border-black font-oswald md:font-arial w-10'>{move.power === null ? "-" : move.power}</td>
                            <td className='p-1 text-center border border-black font-oswald md:font-arial w-10'>{move.pp === null ? "-" : move.pp}</td>
                            <td className='p-1 text-center border border-black font-oswald md:font-arial w-10'>{move.accuracy === null ? "-" : move.accuracy}</td>
                            <td className='p-1 border border-black font-oswald md:font-arial overflow-y-auto max-w-32'>
                                <p className={`${expandedRows.includes(index) ? '' : 'line-clamp-1'} ${isMobile ? 'text-sm' : ''} text-left`}>{move.effect_entries[0]?.effect}</p>
                                {move.effect_entries[0]?.effect.length > 50 || isMobile || isTablet ? (
                                    <button
                                    onClick={() => toggleRowExpansion(index)}
                                    className="text-blue-600 hover:underline mt-2"
                                    >
                                    {expandedRows.includes(index) ? 'Read less' : 'Read more'}
                                    </button>
                                ) : (
                                    null
                                )}
                            </td>
                        </tr>
                    )) : (
                        null
                    )}
                </tbody>
            </table>
        </div>
    </>
  )
}

export default PokemonMoves