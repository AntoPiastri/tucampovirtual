import { createTheme } from "@mui/material";
import {red} from "@mui/material/colors"


export const firstTheme = createTheme ({
    palette:{
        primary : {
            main : "#485228"
        },
        secondary : {
            main: "#88795f"
        },
        error:{
            main: red.A400
        },
        transparencias : {
            main : "rgba(136, 121, 95, 0.4)"
        }
    }
})