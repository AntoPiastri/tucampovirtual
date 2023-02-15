import { useSelector } from "react-redux"
import { Route, Routes } from "react-router-dom"
import { AuthRouter } from "../auth/routes/AuthRoutes"
import { GestorRoutes } from "../gestor/routes/GestorRoutes"
import { selectUser } from "../store/auth"

export const AppRouter = () => {

    return(
        <Routes>

            {/*Login y registro*/}
            <Route path="/auth/*" element= {<AuthRouter/>}/>

            {/*Backita*/}
            <Route path="/*" element= {<GestorRoutes/>}/>

        </Routes>
    )
}