import { lazy, Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./layouts/Layout"
const IndexPage = lazy(() => import('./views/IndexPage'))
const MyTeam = lazy(() => import('./views/MyTeam'))

function AppRouter() {
  return (
    <BrowserRouter>
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Suspense><IndexPage /></Suspense>} />
                <Route path="/myteam" element={<Suspense><MyTeam /></Suspense>} />
            </Route>
        </Routes>
    </BrowserRouter>
  )
}

export default AppRouter