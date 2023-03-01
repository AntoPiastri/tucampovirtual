import { createTheme } from "@mui/material";
import {red} from "@mui/material/colors"


export const firstTheme = createTheme ({
    palette:{
        primary : {
            main : "rgba(72, 82, 40, 0.8)"
        },
        secondary : {
            main: "rgba(136, 121, 95, 0.8)"
        },
        error:{
            main: red.A400
        },
        transparencias : {
            main : "rgba(136, 121, 95, 0.4)"
        }
    }
})