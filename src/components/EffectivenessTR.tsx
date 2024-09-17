import { useAppStore } from "../stores/useAppStore"

type EffectivenessTRProps = {
    effectiveText : string
    effectiveType : string[]
}

function EffectivenessTR({effectiveText, effectiveType} : EffectivenessTRProps) {

    const typeColor = useAppStore(state => state.typeColor)

  return (
    <tr className="border border-black">
        <td className="border-r border-black text-center font-oswald font-bold p-1">{effectiveText}</td>
        <td className="flex flex-wrap gap-1 justify-center p-1">
            {effectiveType.length !== 0 ? (
                effectiveType.map((type, index) => (
                    <span 
                        key={index} 
                        className={`${typeColor(type)} p-1 md:p-2 rounded-full text-white font-bold uppercase text-center`}
                    >{type}</span>
                ))
            ) : (
                <span>None</span>
            )}
        </td>
    </tr>
  )
}

export default EffectivenessTR