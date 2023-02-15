import { Grid, Typography } from "@mui/material"

export const AuthLayout = ({children, title = ""}) => {
    return (
        <Grid container spacing={0} direction= "column" alignItems="center" justifyContent="center" sx={{ minHeight: "100vh", backgroundImage:`url("http://demos.alan.sh/files/images/xYsY4.jpg")`,backgroundSize: "cover", backgroundPosition:"10% 52%", padding:4 }}>
            <Grid item className="box-shadow"
            xs={3}
            sx= {{ width:{sm: 450}, backgroundColor: 'rgba(255, 255, 255, 0.5)', padding:3, borderRadius:2}}>
                <Typography variant="h5">{title}</Typography>
                {children}
            
             </Grid>   

        </Grid>

    )
}