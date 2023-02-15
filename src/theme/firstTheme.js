import { createTheme } from "@mui/material";
import {red} from "@mui/material/colors"


export const firstTheme = createTheme ({
    palette:{
        primary : {
            main : "#485228",
            secondary : "#000000"
        },
        secondary : {
            main: "#543884"
        },
        error:{
            main: red.A400
        },
        mainPageButton : {
            main : "#88795f"
        },
        firstPageButton : {
            main : "#485228"
        }
        
    }
})