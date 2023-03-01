import { useSelector } from "react-redux"
import { Navigate, Route, Routes } from "react-router-dom"
import { selectUser } from "../../store/auth"
import { AgregarEstablecimientoPage } from "../pages/AgregarEstablecimientoPage"
import { AnimalesPage } from "../pages/AnimalesPage"
import { EstablecimientosPage } from "../pages/EstablecimientosPage"
import { GestorPage } from "../pages/GestorPage"
import { TrabajoPesoPage } from "../pages/TrabajoPesoPage"
import { TrabajoReproductivoPage } from "../pages/TrabajoReproductivoPage"
import { TrabajoSanitarioPage } from "../pages/TrabajoSanitarioPage"
import { TrabajosPages } from "../pages/TrabajosPage"
import { UserPage } from "../pages/UserPage"

export const GestorRoutes = () => {
    const user = useSelector(selectUser)
    if (!user)
    {
        return <Navigate to={"auth/*"}/>
    }
    return (
        <Routes>
            /*<Route path="/" element= {<GestorPage/>}/>*/
            <Route path="/user" element= {<UserPage/>}/>
            <Route path="/establecimientos" element= {<EstablecimientosPage/>}/>
            <Route path="/nuevo/establecimiento" element= {<AgregarEstablecimientoPage/>}/>
            <Route path="/animales" element= {<AnimalesPage/>}/>
            <Route path="/trabajos" element= {<TrabajosPages/>}/>
            <Route path="/trabajos/peso" element= {<TrabajoPesoPage/>}/>
            <Route path="/trabajos/reproductivo" element= {<TrabajoReproductivoPage/>}/>
            <Route path="/trabajos/sanitario" element= {<TrabajoSanitarioPage/>}/>

            <Route path="/*" element= {<Navigate to={"/"}/>}/>
        </Routes>
    )
}


