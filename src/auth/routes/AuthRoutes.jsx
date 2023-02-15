
import { useSelector } from "react-redux"
import { Navigate, Route, Routes } from "react-router-dom"
import { InicioPage } from "../../gestor/pages/InicioPage"
import { selectUser } from "../../store/auth"
import { LoginPage, RegisterPage } from "../pages"
import { RecoveryPasswordPage } from "../pages/RecoveryPasswordPage"

export const AuthRouter = () => {
    
    return (
        <Routes>
            <Route path="login" element = {<LoginPage/>} />
            <Route path="register" element = {<RegisterPage/>} />
            <Route path="start" element = {<InicioPage/>} />
            <Route path="passwordrecovery" element = {<RecoveryPasswordPage/>} />

            <Route path="/*" element = {<Navigate to="/auth/start"/>} />

            
        </Routes>
    )
}

