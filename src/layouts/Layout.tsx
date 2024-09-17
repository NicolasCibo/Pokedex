import { Outlet } from "react-router-dom"
import Header from "../components/Header"
import PokemonModal from "../components/PokemonModal"
import Notification from "../components/Notification"
import ScrollToTopButton from "../components/ScrollToTopButton"
import { useAppStore } from "../stores/useAppStore"
import { useEffect } from "react"

function Layout() {

  const loadFromStorage = useAppStore((state) => state.loadFromStorage)

  useEffect(() => {
    loadFromStorage()
  }, [])

  return (
    <>
      <Header />
      <Outlet />
      <PokemonModal />
      <Notification />
      <ScrollToTopButton />
    </>
  )
}

export default Layout