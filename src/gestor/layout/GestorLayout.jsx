import { Box } from "@mui/system"
import { NavBar } from "../components/NavBar"

export const GestorLayout = ({children}) => {
    return (
        <Box sx={{display: "flex"}}>
            <NavBar/>
            {children}
        </Box>
    )
}