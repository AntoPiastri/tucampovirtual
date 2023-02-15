import { ThemeProvider } from "@emotion/react"
import { CssBaseline } from "@mui/material"
import { firstTheme } from "./firstTheme"

export const AppTheme = ({children}) => {
    return (
        <ThemeProvider theme={firstTheme}>
            <CssBaseline/>
            {children}
        </ThemeProvider>
    )
}