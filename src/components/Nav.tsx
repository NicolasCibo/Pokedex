import { NavLink } from "react-router-dom"
import useMediaQuery from '@mui/material/useMediaQuery'

type NavProps = {
    menuOpen: boolean
    toggleMenu: () => void
}

function Nav({menuOpen, toggleMenu} : NavProps) {

  const isMobile = useMediaQuery('(max-width: 768px)')
  
  return (
    <nav className={`${!menuOpen ? "hidden my-auto md:block" : ""}`}>
        <ul className={`flex ${menuOpen ? "flex-col mt-10" : "flex-row"} gap-5`}>
          <li className="mt-2">
            <NavLink to="/" onClick={isMobile ? toggleMenu : undefined}
              className={({isActive}) => `${isActive ? "text-yellow-300" : "text-white"} ${isMobile ? "text-3xl" : "text-xl"} font-extrabold uppercase hover:cursor-pointer`}
            >Pokédex</NavLink>
          </li>
          <li className="mt-2">       
            <NavLink to="myteam" onClick={isMobile ? toggleMenu : undefined}
              className={({isActive}) => `${isActive ? "text-yellow-300" : "text-white"} ${isMobile ? "text-3xl" : "text-xl"} font-extrabold uppercase hover:cursor-pointer`}
            >My Team</NavLink>
          </li> 
        </ul>
    </nav>
  )
}

export default Nav